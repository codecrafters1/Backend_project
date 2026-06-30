import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";

const userRegister = async (req,res) =>{
try {
    const {username,password,email} = req.body;

    if(!(username && password && email)){
        throw new ApiError(400,"username, password and email are required")
    }
  
    const user = User.create({
        username,
        password,
        email
    });

    return res.status(201).json({
        success: true,
        user
    });
} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    })
}
}


const userLogin = async (req,res) =>{
    try {
        const {username,email,password} = req.body;
      
        if(!username && !email){
            throw new ApiError(400,"provide username or email");
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
           throw new ApiError(404,"User with provided details does not exist");
        }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if (!isPasswordValid){
    throw new ApiError(400,"credentials  are incorrect");
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   options = {
    httpsOnly:true,
    secure:true
   }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(  {
                user: loggedInUser, accessToken, refreshToken
            },
        )


} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    })
}
}


const generateAccessAndRefreshTokens = async (userId) =>{
 
    try {
        const user = await User.findById(userId)
        
        const accessToken = user.generateAccessToken()
       
        const refreshToken =  user.generateRefreshToken()
        

        user.refreshToken = refreshToken
      
        const res = await user.save()
        
        return {accessToken, refreshToken}


    } catch (error) { 
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
  

}



const accesstokengenerate = (req,res) =>{
   try {
     const {refreshToken} = req.cookies;

    if(!refreshToken){
        throw new ApiError(400,"refresh token is required");
    }

    const userinfo = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)


    const user = await  User.findById(userinfo._id);
    const accesstoken = user.accessToken();
   
    options = {
    httpsOnly:true,
    secure:true
   }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(  {
                user: loggedInUser, accessToken
            },
        )
  
   } catch (error) { 
        throw new ApiError(500, "Something went wrong while generating access token")
    }
   


}



export {userLogin,userRegister,accesstokengenerate}
import mongoose from "mongoose";

const userSchema = new  mongoose.Schema({
username:{
    type: String,
    require:true,
},
password : {
    type: String,
    require:true,
},
refreshToken:{
    type:String,
}

},{timestamps:true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
    
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password,this.password)  
}

userSchema.methods.generateAccessToken = function(){
return  jwt.sign({
        _id:this._id,
        userName:this.userName,
      
    },
    process.env.ACCESS_TOKEN_SECRET, 
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function(){
return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET, 
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",userSchema);

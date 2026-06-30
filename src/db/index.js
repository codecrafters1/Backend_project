import mongoose from "mongoose";
import  {db_Name}  from "../constant.js";

 const connectDb = async () =>{
    try{
            const dbInstance = await  mongoose.connect(`${process.env.MONGODB_URI}/${db_Name}`);
            console.log(`database connection successfully ${dbInstance.Connection.host}`);

    } catch(err){
      console.log(err)
    }
    
}

export  default connectDb;
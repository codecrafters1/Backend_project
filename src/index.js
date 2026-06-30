import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js';
dotenv.config();

connectDB()
.then( ()=>{
  app.on("error",(error)=>{
    console.log("ERROR:",error);
    throw error
  })  
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`o Server is listening at port : ${process.env.PORT}`);
  })
})
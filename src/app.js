import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import router from "./routes/user.routes"
const app = express()

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true}));

app.use(cookieParser())
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


app.use("/api/user",router)




export {app}
import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

import dotenv from 'dotenv';
dotenv.config();

const app = express()

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

app.listen(5000, ()=>{
    console.log("server is running onport 5000");
})
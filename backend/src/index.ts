import express from "express"
import cookieParsser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

import dotenv from 'dotenv';
dotenv.config();

const app = express()

app.use(cookieParsser()); // for parssing cookies
app.use(express.json()); // for parsing application/jsom

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

app.listen(5000, ()=>{
    console.log("server is running onport 5000");
})

// todo: add socket.io
// todo: make this ready for deployment
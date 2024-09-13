import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/geneerateToken.js";

export const signup = async (req:Request, res:Response) => {
    try{
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if( !fullName || !username || !password || !confirmPassword || !gender ) {
            return res.status(400).json({ error: "please fill all the feilds" });
        }
        if( password != confirmPassword ){
            return res.status(400).json({ error: "confirmpassword doesnot match" });
        }
        const user = await prisma.user.findUnique({where : {username}});
        if(user){
            return res.status(400).json({ error: "username already exists" })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // making dynamic avatar useing api 
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password : hashedPassword,
                gender,
                profilePic : gender === "male" ? boyProfilePic : girlProfilePic
            }
        });

        if(newUser){
            // generate jwt token in a sec
            generateToken(newUser.id, res);

            return res.status(201).json({ 
                id: newUser.id,
                username: newUser.username,
                fullName: newUser.fullName,
                boyProfilePic: newUser.profilePic
             })
        } else {
            return res.status(400).json({error : "invalid user data"});
        }
    } catch(error:any){
        console.log(error.message);
        return res.status(500).json({ error: "internal server error" });
    }
}
export const login = async (req:Request, res:Response) => {
    try{
        const { username, password } = req.body;
        if( !username || !password ){
            return res.status(400).json({ error: "please fill all the feilds" });
        };

        const user = await prisma.user.findUnique({ where: {username} });
        if(!user){
            return res.status(400).json({ error: "invalid credentials" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({ error: "invalid credentials" });
        }

        generateToken(user.id, res);
        res.status(200).json({ success: "loggedin successfully"
            // id: user.id,
            // fullName: user.fullName,         
            // username: user.username,         
            // profilePic: user.profilePic
        });

    } catch(error:any){
        console.log(error);
        return res.status(500).json({ error: "internal server error" });
    }
};
export const logout = async (req:Request, res:Response) => {
    try{
        res.cookie("jwt", "", {maxAge: 0 });
        res.status(200).json({  message: "loggedout sucessfully" });
    } catch(error){
        console.log(error);
        return res.status(500).json({ error: "internal server error" });
    }
}

export const getMe = async(req: Request, res: Response) => {
    try{
        const user = await prisma.user.findUnique({ where: {id: req.user.id} });
        if(!user){
            return res.status(404).json({ error: "user not found" });
        }

        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profoilePic: user.profilePic
        });
    } catch(error: any) {
        console.log(error);
        return res.status(500).json({ error: "internal server error" });
    }
}
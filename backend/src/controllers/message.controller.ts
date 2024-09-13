import { Request, Response } from "express";
import prisma from "../db/prisma.js";

export const sendMessage = async (req:Request, res:Response) => {
    try{
        const { message } = req.body;
        const { id:reciverId } = req.params;
        const senderId = req.user.id;

        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, reciverId]
                }
            }
        });

        if(!conversation){
            // make new conversation
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, reciverId]
                    }
                }
            });
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id
            }
        });

        if(newMessage) {
            conversation = await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id
                        },
                    },
                }
            });
        }

        // socket.io will implemented here
        res.status(200).json({ success: message });
    } catch(error: any){
        console.log(error);
        return res.status(500).json({ error: "internal server error" });
    }
}

export const getMessage = async (req:Request, res:Response) => {
    try{
        // jisse baat krre uski id 
        const { id: userToChatId } = req.params;
        // tumhari id
        const senderId = req.user.id;
        
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });

        if(!conversation){
            return res.status(200).json({ messages: [] });
        }

        return res.status(200).json({ messages: conversation.messages });
    } catch(error: any){
        console.log(error);
        return res.status(500).json({ error: "internal server error" });
    }
}

export const getUsersForSidebar = async (req: Request, res: Response) => {
    try{
        const authUserid = req.user.id;

        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserid
                },
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true
            },
        });

        return res.status(200).json({ users });
    } catch(error: any){
        console.log(error);
        return res.status(500).json({ error: "internal server error" });
    }
}
import { Request, Response } from "express"
import { sendError } from "../../helper/sendError";
import { authServices } from "./auth.services";

const createUser=async(req:Request,res:Response)=>{
    try {
        console.log(req.body);
        const result= await authServices.createUser(req.body)

        console.log(result);
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:result
        })

    } catch (error:any) {
        console.log(error);
        sendError(res,error)
    }
}



const loginUser=async(req:Request,res:Response)=>{
    try {
        const result=await authServices.loginUser(req.body)

        res.status(200).json({
            success:true,
            message:"Login successful",
            data:result
        })

    } catch (error:any) {
        console.error(error)
        sendError(res,error)
    }
}

export const authController={
    createUser,
    loginUser
}
import { Request, Response } from "express";
import { sendError } from "../../helper/sendError";
import { userServices } from "./users.services";


const getAllUser=async(req:Request,res:Response)=>{
    try {
        const result=await userServices.getAllUser()

        res.status(200).json({
            success:true,
            message:"Users retrieved successfully",
            data:result
        })
    } catch (error:any) {
        sendError(res,error)
    }
}


const updateUser=async(req:Request,res:Response)=>{
    try {
        const id=parseInt(req.params.userId!);
        // console.log(id);
        const result=await userServices.updateUser(req,id,req.body)

        res.status(200).json({
            success:true,
            message:"User updated successfully",
            data:result
        })
    } catch (error:any) {
        sendError(res,error)
    }
}







// const getAllUser=async(req:Request,res:Response)=>{
//     try {
//         const result=await 

//         res.status(200).json({
//             success:true,
//             message:"",
//             data:result
//         })
//     } catch (error:any) {
//         sendError(res,error)
//     }
// }



export const userController={
    getAllUser,
    updateUser
}


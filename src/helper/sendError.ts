import { Response } from "express";

export const sendError=(res:Response,error:any)=>{
    res.status(500).json({
        success:false,
        message:error.message,
        error:error
    })
}


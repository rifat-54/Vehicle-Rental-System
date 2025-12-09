import { Request, Response } from "express";
import { sendError } from "../../helper/sendError";
import { bookingServices } from "./booking.services";

const createBooking=async(req:Request,res:Response)=>{
    try {
        const result=await bookingServices.createBooking(req.body)

        res.status(201).json({
            success:true,
            message:"Booking created successfully",
            data:result
        })
    } catch (error:any) {
        sendError(res,error)
    }
}


// const createBooking=async(req:Request,res:Response)=>{
//     try {
//         const result=await 

//         res.status(201).json({
//             success:true,
//             message:"Booking created successfully",
//             data:result
//         })
//     } catch (error:any) {
//         sendError(res,error)
//     }
// }


export const bookingController={
    createBooking
}
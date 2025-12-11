import { Request, Response } from "express";
import { sendError } from "../../helper/sendError";
import { bookingServices } from "./booking.services";
import { JwtPayload } from "jsonwebtoken";

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

const getBookings=async(req:Request,res:Response)=>{
    try {
        const decoded=req.user as JwtPayload
        // console.log("from bokings-> ",decoded);

        if(decoded!.role==='admin'){
            const result=await bookingServices.getBookingsByAdmin()
            res.status(200).json({
            success:true,
            message:"Bookings retrieved successfully",
            data:result
           })
        }else{
            const result=await bookingServices.getBookingsByCustomer(decoded.email)
            res.status(200).json({
            success:true,
            message:"Your bookings retrieved successfully",
            data:result
           })
        }

        
    } catch (error:any) {
        sendError(res,error)
    }
}

const updateBookings=async(req:Request,res:Response)=>{
    try {
        const decoded=req.user as JwtPayload

        if(decoded!.role==='admin'){
            const result=await bookingServices.updateBookingsByAdmin(req)
            res.status(200).json({
            success:true,
            message:"Booking marked as returned. Vehicle is now available",
            data:result
           })
        }else{
            const result=await bookingServices.updateBookingByCustomer(req)
            res.status(200).json({
            success:true,
            message:"Booking cancelled successfully",
            data:result
           })
        }

        
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
    createBooking,
    getBookings,
    updateBookings
}
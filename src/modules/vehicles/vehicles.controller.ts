import { Request, Response } from "express";
import { sendError } from "../../helper/sendError";
import { vehiclesServices } from "./vehicles.services";

const createVehicle=async(req:Request,res:Response)=>{
    try {
        const result=await vehiclesServices.createVehicle(req.body)

        res.status(201).json({
            success:true,
            message: "Vehicle created successfully",
            data:result
        })

    } catch (error:any) {
        sendError(res,error)
    }
}

const getAllVehicles=async(req:Request,res:Response)=>{
    try {
        const result=await vehiclesServices.getAllVehicles();

        res.status(200).json({
            success:true,
            message:"Vehicles retrieved successfully",
            data:result
        })
        
    } catch (error) {
        sendError(res,error)
    }

}



export const vehiclesController={
    createVehicle,
    getAllVehicles
}
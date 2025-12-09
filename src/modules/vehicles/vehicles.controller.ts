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

const getSingleVehicles=async(req:Request,res:Response)=>{

    try {
        const vehicleId=parseInt(req.params.vehicleId!);

        // console.log(typeof(vehicleId));
       
        
        const result=await vehiclesServices.getSingleVehicles(vehicleId);

        res.status(200).json({
            success:true,
            message:"Vehicle retrieved successfully",
            data:result
        })


    } catch (error) {
        sendError(res,error)
    }

}



export const vehiclesController={
    createVehicle,
    getAllVehicles,
    getSingleVehicles
}
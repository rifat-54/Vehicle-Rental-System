import express, { Request, Response } from "express"
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { userRoutes } from "./modules/users/users.routes";

const app=express();

//parser
app.use(express.json())

initDB()

//auth routes
app.use("/api/v1/auth",authRoutes)

//vehicles routes
app.use("/api/v1/vehicles",vehiclesRoutes)

//user routes
app.use("/api/v1/users",userRoutes)

app.get("/",async(req:Request,res:Response)=>{
    res.json({
        messae:"server is running"
    })
    
})



export default app;
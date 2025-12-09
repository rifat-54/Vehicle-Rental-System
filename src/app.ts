import express, { Request, Response } from "express"
import initDB from "./config/db";

const app=express();

initDB()

app.get("/",async(req:Request,res:Response)=>{
    res.json({
        messae:"server is running"
    })
    
})



export default app;
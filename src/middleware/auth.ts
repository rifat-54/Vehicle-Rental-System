import { NextFunction, Request, Response } from "express"
import { sendError } from "../helper/sendError"
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../config"

const auth=(...role:string[])=>{
    return async(req:Request,res:Response,next:NextFunction)=>{

        try {
            
            const token=req.headers.authorization?.split(" ")[1]
            // console.log(token);
            if(!token){
               return res.status(401).json({
                    success:false,
                    message:"Unauthorized access!"
                })
            }
            
            const decoded=await jwt.verify(token!,config.jwt_secret as string) as JwtPayload
            // console.log(decoded);

            req.user=decoded;
            if(role.length!==0 && !role.includes(decoded.role)){
                return res.status(403).json({
                    success:false,
                    message:"Forbidden access!"
                })
            }

            next()

        } catch (error) {
            sendError(res,error)
        }

    }
}

export default auth;
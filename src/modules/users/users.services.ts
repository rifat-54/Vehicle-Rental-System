import { Request } from "express";
import { pool } from "../../config/db"

const getAllUser=async()=>{
    try {
        const result=await pool.query(`
            SELECT id,name,email,phone,role FROM users 
            `)

         return result.rows;

    } catch (error) {
        throw error;
    }
}


const updateUser=async(req:Request,id:number,payload:Record<string,unknown>)=>{

    // console.log(payload);
    try {

        const {name,email,phone,role}=payload;

        const decoded=req.user;

        // console.log(decoded);

        if(decoded?.role==='customer'){
            const result=await pool.query(`
            UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE email=$5 RETURNING *
            `,[name,email,phone,role,decoded.email])

            const user=result.rows[0];
        delete user.password;
        return user;

        }

      

        const result=await pool.query(`
            UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE id=$5 RETURNING *
            `,[name,email,phone,role,id])

        //  return result;

        const user=result.rows[0];
        delete user.password;
        return user;
        // console.log(result);
            
    } catch (error) {
        throw error;
    }
}


const deleteUser=async(userId:string | number)=>{

    // status=$2 

    try {
        const result=await pool.query(`
            SELECT * FROM bookings WHERE customer_id=$1 AND status=$2
            `,[userId,'active'])

        //  console.log(result.rows);
         if(result.rows.length){
            throw Error("User can't be delete . User has active bookings")
         }

        const dRes= await pool.query(`
            DELETE FROM users WHERE id=$1
            `,[userId])
        
        // console.log(dRes);
        if(dRes.rowCount===0){
            throw Error("User not found!")
        }
    } catch (error) {
        throw error;
    }
}


export const userServices={
    getAllUser,
    updateUser,
    deleteUser
}
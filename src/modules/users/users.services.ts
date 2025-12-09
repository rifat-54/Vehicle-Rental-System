import { pool } from "../../config/db"

const getAllUser=async()=>{
    try {
        const result=await pool.query(`
            SELECT name,email,phone,role FROM users 
            `)

         return result.rows;

    } catch (error) {
        throw error;
    }
}












// const getAllUser=async()=>{
//     try {
//         const result=await pool.query(`
            
//             `)

//          return result;
            
//     } catch (error) {
//         throw error;
//     }
// }


export const userServices={
    getAllUser
}
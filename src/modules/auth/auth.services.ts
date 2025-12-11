import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken"
import config from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
  try {
    const { name, email, password, phone, role } = payload;

    const hasedPass = await bcrypt.hash(password as string, 10);

    const result = await pool.query(
      `
        INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING *
        `,
      [name, email, hasedPass, phone, role]
    );

    const user = result.rows[0];
    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (payload: Record<string, unknown>) => {
  try {
    const { email, password } = payload;
    // console.log(email, password);

    const result=await pool.query(`
        SELECT * FROM users WHERE email=$1
        `,[email])
    if(result.rows.length===0){
        return "user not found";
    }
    const user=result.rows[0];

    const match=await bcrypt.compare(password as string,user.password)

    if(!match){
        return "password doesn't match!"
    }

    // console.log(user);
    delete user.password;


    const payload2={
        name:user.name,
        email:user.email,
        role:user.role
    }
        
    // create token
    const token=await jwt.sign(payload2,config.jwt_secret as string,{
        expiresIn:"7d"
    })

    // console.log(token);
    const data={
        token:token,
        user:user
    }

    return data;

  } catch (error) {
    throw error;
  }
};

export const authServices = {
  createUser,
  loginUser,
};

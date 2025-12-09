import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  try {
    console.log(payload);
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = payload;

    const vehicles_type=['car', 'bike', 'van','SUV']

    if(!vehicles_type.includes(type as string)){
      return "type is invalid!"
    }

    if(daily_rent_price as number<=0){
        return "Price shuld be more than 0"
    }

    const status=['available','booked']

    if(!status.includes(availability_status as string)){
        return "availability_status should be 'available' or 'booked' "
    }

    const result=await pool.query(`
        INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *
        
        `,[vehicle_name,type,registration_number,daily_rent_price,availability_status])
    
        return (result.rows[0]);


  } catch (error) {
    throw error
  }
};

const getAllVehicles=async()=>{
    try {
        const result=await pool.query(`
        SELECT * FROM vehicles
        `)
        return result.rows;

    } catch (error) {
        throw error;
    }
}

const getSingleVehicles=async(id:number)=>{
    try {
        const result=await pool.query(`
            SELECT * FROM vehicles WHERE id=$1
            `,[id])
            return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const vehiclesServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicles
};

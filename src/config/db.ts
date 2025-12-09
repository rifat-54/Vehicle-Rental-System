import { Pool } from "pg";
import config from ".";

export const pool=new Pool({
    connectionString:`${config.connection_str}`
})

const initDB=async()=>{

    //user table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL CHECK(email=LOWER(email)),
        password TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN ('admin','customer')),
        created_at TIMESTAMP DEFAULT NOW()
        )
        
        `)


        //vehicle table

        await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(200) NOT NULL,
            type VARCHAR(100) NOT NULL CHECK(type IN ('car', 'bike', 'van','SUV')),
            registration_number VARCHAR(200) UNIQUE NOT NULL,
            daily_rent_price NUMERIC CHECK(daily_rent_price>0) NOT NULL,
            availability_status VARCHAR(100) NOT NULL CHECK(availability_status IN ('available','booked')),
            created_at TIMESTAMP DEFAULT NOW()
            )
            `)

            //booking table

            await pool.query(`
                CREATE TABLE IF NOT EXISTS bookings(
                id SERIAL PRIMARY KEY,
                customer_id INT REFERENCES users(id) ON DELETE CASCADE,
                vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
                rent_start_date DATE NOT NULL,
                rent_end_date DATE NOT NULL CHECK(rent_end_date > rent_start_date),
                total_price NUMERIC CHECK(total_price>0) NOT NULL,
                status VARCHAR(100) NOT NULL CHECK(status IN ('active', 'cancelled','returned')),
                created_at TIMESTAMP DEFAULT NOW()
                )
                
                `)
}


export default initDB;
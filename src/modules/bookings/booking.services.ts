import e, { Request } from "express";
import { pool } from "../../config/db";
import { JwtPayload } from "jsonwebtoken";
import cron from "node-cron"

const createBooking=async(payload:Record<string,unknown>)=>{
    try {
        // console.log(payload);

        const {customer_id,vehicle_id,rent_start_date,rent_end_date}=payload;

        const start=new Date(rent_start_date as string)
        const end=new Date(rent_end_date as string)

        const diff=end.getTime()-start.getTime();

        if(diff<=0){
            throw new Error("rent_end_date will be after rent_start_date") 
        }

        const day=Math.ceil(diff/(1000*60*60*24))
        

        //get the vehicle
        const vehicle=await pool.query(`
            SELECT * FROM vehicles WHERE id=$1
            `,[vehicle_id])

            // console.log(vehicle.rows[0]);
            if(vehicle.rows.length===0){
                throw new Error("vehicle_id is not valid!") 
            }

            if(vehicle.rows[0].availability_status!=='available'){
                throw new Error("This vehicle is already booked.Book another") 
            }

            const vehicle_rent=Number(vehicle.rows[0].daily_rent_price);
            // console.log(vehicle_rent);

            const totalPrice=day*vehicle_rent;

            // console.log(totalPrice);
 
        // return null;

        const result=await pool.query(`
            INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *
            `,[customer_id,vehicle_id,rent_start_date,rent_end_date,totalPrice,"active"])

            //updat vehicle status

          const vehicleUpdate=  await pool.query(`
                UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *
                `,["booked",vehicle_id])


                // console.log("result-> ",result.rows[0]);
                // console.log("vehicheupdate -> ",vehicleUpdate.rows[0]);
            const vehicleData=result.rows[0];
            vehicleData.rent_start_date=new Date(vehicleData.rent_start_date).toLocaleDateString('en-CA');
            vehicleData.rent_end_date=new Date(vehicleData.rent_end_date).toLocaleDateString('en-CA')
            vehicleData.vehicle={
               vehicle_name: vehicle.rows[0].vehicle_name,
               daily_rent_price :vehicle.rows[0].daily_rent_price
            }
            // console.log(vehicleData);
                
        return vehicleData;
    } catch (error) {
        throw error;
    }
}

const getBookingsByAdmin=async()=>{
    try {
        const result=await pool.query(`
            SELECT 
            bookings.id,
            bookings.customer_id,
            bookings.vehicle_id,
            TO_CHAR(bookings.rent_start_date,'YYYY-MM-DD') AS rent_start_date,
            TO_CHAR(bookings.rent_end_date,'YYYY-MM-DD') AS rent_end_date,
            bookings.total_price,
            bookings.status,
            json_build_object(
            'name',users.name,
            'email',users.email
            ) AS customer,
             json_build_object(
             'vehicle_name',vehicles.vehicle_name,
             'registration_number',vehicles.registration_number
             ) AS vehicle

            FROM bookings
            JOIN users ON bookings.customer_id=users.id
            JOIN vehicles ON bookings.vehicle_id=vehicles.id

            `)

        return result.rows;
    } catch (error) {
        throw error;
    }
}


const getBookingsByCustomer=async(email:string)=>{
    // console.log(email);
    const user=await pool.query(`
        SELECT id FROM users WHERE email=$1
        `,[email])

        const id=user.rows[0].id;
        // console.log(id);
        const result=await pool.query(`
            SELECT
            bookings.id,
            bookings.vehicle_id,
            TO_CHAR(bookings.rent_start_date,'YYYY-MM-DD') AS rent_start_date,
            TO_CHAR(bookings.rent_end_date,'YYYY-MM-DD') AS rent_end_date,
            bookings.total_price,
            bookings.status,
           

            json_build_object(
            'vehicle_name',vehicles.vehicle_name,
            'registration_number',vehicles.registration_number,
            'type',vehicles.type
            ) AS vehicle

            FROM bookings
            JOIN vehicles ON bookings.vehicle_id=vehicles.id

            WHERE bookings.customer_id=$1
            
            `,[id])

            return result.rows
}

const updateBookingsByAdmin=async(req:Request)=>{
    try {
        
        const id=req.params.bookingId;
        const {status}=req.body;

        
        // console.log('update->',status);
        const result=await pool.query(`
            UPDATE bookings
            SET status=$1 WHERE id=$2 RETURNING 
            id,
            customer_id,
            vehicle_id,
            TO_CHAR(rent_start_date,'YYYY-MM-DD') AS rent_start_date,
            TO_CHAR(rent_end_date,'YYYY-MM-DD') AS rent_end_date,
            total_price,
            status
            `,[status,id])

            const v_id=result.rows[0].vehicle_id;

            //update vehicle status

            const vRes=await pool.query(`
                UPDATE vehicles 
                SET availability_status=$1 WHERE id=$2 RETURNING *
                `,['available',v_id])

            // console.log(result.rows[0],vRes.rows[0]);
        // return result;

        const data={
            ...result.rows[0],
            vehicle:{
                availability_status: vRes.rows[0].availability_status
            }
        }

        return data;
    } catch (error) {
        throw error;
    }
}

const updateBookingByCustomer=async(req:Request)=>{
    try {
        const decoded=req.user as JwtPayload

        const booking_id=req.params.bookingId;
        const{status}=req.body;
        const email=decoded.email;

        // console.log('update->',id,status,email);

        //get user id

        const uRes=await pool.query(`
            SELECT * FROM users WHERE email=$1
            `,[email])

          const userId= uRes.rows[0].id;

        
        const result=await pool.query(`
            UPDATE bookings
            SET status=$1 WHERE id=$2 AND customer_id=$3 RETURNING
            id,
            customer_id,
            vehicle_id,
            TO_CHAR(rent_start_date,'YYYY-MM-DD') AS rent_start_date,
            TO_CHAR(rent_end_date,'YYYY-MM-DD') AS rent_end_date,
            total_price,
            status
            `,[status,booking_id,userId])


            //change the vehicle status

            const v_id=result.rows[0].vehicle_id;

            const vRes=await pool.query(`
                UPDATE vehicles 
                SET availability_status=$1 
                WHERE id=$2
                RETURNING *
                `,['available',v_id])

            
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}


// udate bookings automatically

cron.schedule("0 */1 * * *",async()=>{
   try {
     //update bookings status when date is over
    await pool.query(`
        UPDATE bookings
        SET status='returned'
        WHERE rent_end_date < NOW() AND status!='returned'
        `)

        // update vehicle status

        await pool.query(`
            UPDATE vehicles
            SET status='available'
            WHERE id IN(
            SELECT vehicle_id
            FROM bookings
            WHERE status='returned'
            )
            `)
            
   } catch (error:any) {
    throw Error(error)
   }
})


export const bookingServices={
    createBooking,
    getBookingsByAdmin,
    getBookingsByCustomer,
    updateBookingsByAdmin,
    updateBookingByCustomer
}
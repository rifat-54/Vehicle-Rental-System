Vehicle Rental System

live link: https://vehicle-rental-system-henna.vercel.app/

Project Overview
A backend API for a vehicle rental system project . it allow :  
-manage vehicle tracking  
-manage customer account  
-manage bookings   
-handle vehicle status  
-secure role-based access control (Admin and Customer role)  

Technogy   
-backend: node.js + typescript +express.js  
-database: PostgreSQL  
-Authentication: use bcrypt for make hashing password  
-User Jwt for make token for authorization  

Code Structure  

follow modular pattern  .
- auth  
-users  
-vehicles  
-booking  

Availabe route are :  
for authentication ->   
 POST  - /api/v1/auth/signup   register user
 POST   - /api/v1/auth/signin  login user  

for Vehicle  ->  
POST  -  /api/v1/vehicles             create vehicle only for admin                   
GET   - /api/v1/vehicles              get vehicle public                      
GET   -  /api/v1/vehicles/:id          get spesicfic vehicle details   (admin and customer)                
PUT -   /api/v1/vehicles/:id           updae spesific vehicle (admin only)                
DELETE - /api/v1/vehicles/:id          delete spesific   (admin only)  

for user ->  
GET    - /api/v1/users           get all users (admin only)  
PUT   - /api/v1/users/:id        update users (admin and customer can update own profile)
DELETE - /api/v1/users/:id       delete users (admin only if has no active booking)  

use node-cron for automatically change booking_status return and vehicle_status available when date expire  

Setup & Installation :  

1. clone the repo  
2. cd clone folder   
3.npm install  
4. create .env file on root  and add the value  
5.npm run dev  => for run the server  

Features =>  
* Role-based authentication (Admin * Custoer)  
* Vehicle easy management  
* booking, update, and auto return logic  
* price calclation useing total day and vehicle perday rent  
* Secure password useing hashing and JWT authenticaion  
* Use Modular pattern for backend 




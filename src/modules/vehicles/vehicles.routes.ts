import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router=Router()

router.post("/",auth("admin"),vehiclesController.createVehicle);
router.get("/",vehiclesController.getAllVehicles)

export const vehiclesRoutes=router;
import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router=Router()

router.post("/",auth("admin"),vehiclesController.createVehicle);
router.get("/",vehiclesController.getAllVehicles)
router.get("/:vehicleId",vehiclesController.getSingleVehicles)

export const vehiclesRoutes=router;
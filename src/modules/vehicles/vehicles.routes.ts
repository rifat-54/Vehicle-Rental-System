import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router=Router()

router.post("/",auth("admin"),vehiclesController.createVehicle);
router.get("/",vehiclesController.getAllVehicles)
router.get("/:vehicleId",vehiclesController.getSingleVehicles)
router.put("/:vehicleId",auth("admin"),vehiclesController.updateVehicles)
router.delete("/:vehicleId",auth("admin"),vehiclesController.deleteVehicles)


export const vehiclesRoutes=router;
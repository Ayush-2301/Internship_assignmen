import express from "express";
import validate from "../middleware/validate-schema";

import {
  insertCarSchema,
  updateCarSchema,
} from "../controllers/cars/cars.schema";

import {
  getCarById,
  getCars,
  deleteCarById,
  createNewCar,
  updateCarById,
} from "../controllers/cars/cars.controller";

import authenticate from "../middleware/authenticate";
// import authorizeRole from "../middleware/authorize-role";

const router = express.Router();

router.get("/getCar/:id", getCarById);
router.get("/getAllCars", getCars);
// router.put("/updateCar/:id", validate(updateCarSchema), updateCarById);
// router.post("/createNewCar", validate(insertCarSchema), createNewCar);
// router.delete("/deleteCar/:id", deleteCarById);

export default router;

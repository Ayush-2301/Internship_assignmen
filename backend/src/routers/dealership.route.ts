import express from "express";
import validate from "../middleware/validate-schema";
import { insertMultipleCarSchema } from "../controllers/cars/cars.schema";

import {
  getAllDealershipCars,
  getAllDealershipDeals,
  createDealershipCars,
} from "../controllers/dealership/dealership.controller";

import authorizeRole from "../middleware/authorize-role";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get(
  "/getAllDealershipCars/:id",
  authenticate,
  authorizeRole(["DEALERSHIP", "USER"]),
  getAllDealershipCars
);

router.get(
  "/getAllDealershipDeals/:id",
  authenticate,
  authorizeRole(["DEALERSHIP", "USER"]),
  getAllDealershipDeals
),
  router.post(
    "/createDealershipCars/:id",
    validate(insertMultipleCarSchema),
    authenticate,
    authorizeRole(["DEALERSHIP"]),
    createDealershipCars
  );

export default router;

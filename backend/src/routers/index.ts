import express from "express";

import auth from "./auth.route";
import cars from "./cars.route";
import dealership from "./dealership.route";

const router = express.Router();

router.use("/", auth);
router.use("/cars", cars);
router.use("/dealership", dealership);

export default router;

import express from "express";
import validate from "../middleware/validate-schema";
import {
  loginSchema,
  userRegisterSchema,
  dealershipRegisterSchema,
} from "../controllers/auth/auth.schema";

import {
  login,
  logout,
  userRegister,
} from "../controllers/auth/auth.controller";

import { rateLimiterStrict } from "../middleware/rate-limiter";

const router = express.Router();
router.post("/login", validate(loginSchema), rateLimiterStrict, login);
router.post("/userRegister", rateLimiterStrict, userRegister);

router.get("/logout", rateLimiterStrict, logout);

export default router;

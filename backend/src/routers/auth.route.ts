import express from "express";
import validate from "../middleware/validate-schema";
import {
  loginSchema,
  sendEmailSchema,
  checkEmailSchema,
  verifyOTPschema,
  userRegisterSchema,
  dealershipRegisterSchema,
  resetPasswordSchema,
} from "../controllers/auth/auth.schema";

import {
  userLogin,
  dealershipLogin,
  logout,
  userRegister,
  sendEmail,
  updatePassword,
  dealershipRegister,
  verifyOTP,
  checkEmail,
} from "../controllers/auth/auth.controller";
import authenticatePasswordResetClient from "@/middleware/authorize-reset-password-client";
import { rateLimiterStrict } from "../middleware/rate-limiter";

const router = express.Router();
router.post("/userLogin", validate(loginSchema), rateLimiterStrict, userLogin);

router.post(
  "/dealershipLogin",
  validate(loginSchema),
  rateLimiterStrict,
  dealershipLogin
);
router.post(
  "/userRegister",
  validate(userRegisterSchema),
  rateLimiterStrict,
  userRegister
);

router.get("/logout", rateLimiterStrict, logout);

router.post(
  "/:clientType/checkEmail",
  validate(checkEmailSchema),
  rateLimiterStrict,
  checkEmail
);
router.post(
  "/:clientType/sendEmail",
  validate(sendEmailSchema),
  rateLimiterStrict,
  sendEmail
);
router.post(
  "/verifyOTP",
  validate(verifyOTPschema),
  rateLimiterStrict,
  verifyOTP
);

router.post(
  "/:clientType/resetPassword",
  validate(resetPasswordSchema),
  authenticatePasswordResetClient,
  rateLimiterStrict,
  updatePassword
);

router.post(
  "/dealershipRegister",
  validate(dealershipRegisterSchema),
  rateLimiterStrict,
  dealershipRegister
);
export default router;

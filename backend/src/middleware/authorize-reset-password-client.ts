import { NextFunction, Request, Response } from "express";

import { verifyResetPasswordToken } from "../controllers/auth/auth.utils";

declare module "express-serve-static-core" {
  interface Request {
    clientResetPasswordData: { id: string; email: string };
  }
}
export default function authenticatePasswordResetClient(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { cookies } = req;
    const cookie = cookies.resetPasswordToken;
    if (!cookie)
      return res.status(401).send({ data: null, error: "Unauthorized" });
    const clientTokenData = verifyResetPasswordToken(cookie);
    req.clientResetPasswordData = clientTokenData;
    next();
  } catch (error) {
    res.status(401).send({ data: null, error: "Unauthorized" });
    next();
  }
}

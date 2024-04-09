import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../controllers/auth/auth.utils";
import { ObjectId } from "mongodb";

declare module "express-serve-static-core" {
  interface Request {
    user: { id: ObjectId; email: string; name: string; role: string };
  }
}

export default function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { cookies } = req;
    const cookie = cookies.refreshToken;
    if (!cookie) return res.status(401).send({ error: "Unauthorized" });

    const userTokenData = verifyToken(cookie);
    req.user = userTokenData;
    next();
  } catch {
    res.status(401).send({ error: "Unauthorized" });
    next();
  }
}

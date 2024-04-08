import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { JWT_SECRET_KEY } from "../../config";
import { ObjectId } from "mongodb";

export function createAccessToken(id: ObjectId, email: string, name: string) {
  const payload = { id, email, name };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "24h" });
  return token;
}
export function createRefreshToken(id: ObjectId, email: string, name: string) {
  const payload = { id, email, name };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "30d" });
  return token;
}

export function setRefreshCookie(res: Response, refreshToken: string) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", refreshToken, {
      httpOnly: true,
      expires: date,
      sameSite: "none",
      secure: true,
      path: "/",
    })
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET_KEY) as {
    id: ObjectId;
    email: string;
    name: string;
  };
}

import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { JWT_SECRET_KEY } from "../../config";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export function createAccessToken(
  id: ObjectId,
  email: string,
  name: string,
  role: string
) {
  const payload = { id, email, name, role };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "24h" });
  return token;
}
export function createRefreshToken(
  id: ObjectId,
  email: string,
  name: string,
  role: string
) {
  const payload = { id, email, name, role };
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
    role: string;
  };
}

export function generateOTP() {
  return new Promise<string>((res) =>
    crypto.randomBytes(3, (err, buffer) => {
      res(parseInt(buffer.toString("hex"), 16).toString().substring(0, 6));
    })
  );
}

export function createResetPasswordAccessToken(id: ObjectId, email: string) {
  const payload = { id, email };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1h" });
  return token;
}
export function setResetPasswordCookie(res: Response, refreshToken: string) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("resetPasswordToken", refreshToken, {
      httpOnly: true,
      expires: date,
      sameSite: "none",
      secure: true,
      path: "/",
    })
  );
}

export function verifyResetPasswordToken(token: string) {
  return jwt.verify(token, JWT_SECRET_KEY) as {
    id: string;
    email: string;
  };
}

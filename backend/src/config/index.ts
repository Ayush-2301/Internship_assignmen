import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";

dotenv.config();

/* App Config */
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as Secret;
export const ORIGIN = process.env.ORIGIN || "*";

/* DB Config */
export const DATABASE_URL = process.env.DATABASE_URL;
export const DB_NAME = process.env.DB_NAME;

export const MY_EMAIL = process.env.MY_EMAIL;
export const APP_PASSWORD = process.env.APP_PASSWORD;

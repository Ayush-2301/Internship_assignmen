import * as dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import validateEnv from "@utils/validate-env";
import bodyParser from "body-parser";
import cookies from "cookie-parser";
import { ORIGIN } from "./config";
import errorHandler from "@middleware/error-handler";
import { rateLimiter } from "@middleware/rate-limiter";
import routes from "@/routers";
import { connectDB } from "@/db/index";

connectDB();

dotenv.config();

validateEnv();

const app: Application = express();

app.use(express.json());
app.use(cookies());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(errorHandler);
app.use(rateLimiter);
app.use("/api", routes);
export default app;

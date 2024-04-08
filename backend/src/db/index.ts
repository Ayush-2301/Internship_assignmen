import * as mongodb from "mongodb";
import { DB_NAME, DATABASE_URL } from "../config/index";

export let db: mongodb.Db;
export const connectDB = async () => {
  try {
    if (!DATABASE_URL) throw new Error("Database url required");
    const client: mongodb.MongoClient = new mongodb.MongoClient(DATABASE_URL);
    await client.connect();
    const dbConnect: mongodb.Db = client.db(DB_NAME);
    db = dbConnect;
    console.log("Connected to db");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

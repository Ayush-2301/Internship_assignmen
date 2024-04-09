import * as mongodb from "mongodb";
import { DB_NAME, DATABASE_URL } from "../config/index";

export let db: mongodb.Db;
export const connectDB = async () => {
  try {
    if (!DATABASE_URL) throw new Error("Database url required");
    const client: mongodb.MongoClient = new mongodb.MongoClient(DATABASE_URL);
    await client.connect();
    const dbConnect: mongodb.Db = client.db(DB_NAME);
    // await createUserSchema();
    // createDealershipSchema();
    // createResetPasswordOTPSchema();
    db = dbConnect;
    console.log("Connected to db");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// const createUserSchema = async () => {
//   db.command({
//     collmod: "User",
//     validator: {
//       $jsonSchema: {
//         bsonType: "object",
//         required: ["userEmail", "location", "userInfo", "password", "role"],
//         additionalProperties: false,
//         properties: {
//           _id: {},
//           userEmail: {
//             bsonType: "string",
//             description: "'email' is required",
//           },
//           location: {
//             bsonType: "string",
//             description: "'location' is required",
//           },
//           password: {
//             bsonType: "string",
//             description: "'password' is required",
//           },
//           role: {
//             bsonType: "string",
//             description: "'role' is required",
//           },
//           userInfo: {
//             bsonType: "object",
//             title: "User info validation",
//             required: ["userName"],
//             additionalProperties: false,
//             properties: {
//               userName: {
//                 bsonType: "string",
//                 description: "'userName' is required",
//               },
//               userAvatarUrl: {
//                 bsonType: "string",
//                 description: "user avatar url",
//               },
//             },
//           },
//           vehicleInfo: {},
//         },
//       },
//     },
//   });
// };

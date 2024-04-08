import bcrypt from "bcrypt";
import { db } from "../../db";
import { Dealership, ResetPasswordOTP, User } from "../../models";
import { ObjectId, WithId } from "mongodb";

export async function getUser(userEmail: string) {
  const res = await db
    .collection<User>("User")
    .findOne({ userEmail: userEmail });
  return res;
}
export async function getDealership(dealershipEmail: string) {
  const res = await db
    .collection<Dealership>("Dealership")
    .findOne({ dealershipEmail: dealershipEmail });
  return res;
}

export async function verifyLogin(email: string, password: string) {
  const user: WithId<User> = await getUser(email);
  if (!user) return null;
  const passwordIsValid = await bcrypt.compare(password, user.password);
  return passwordIsValid ? user : null;
}

export async function addUser(req: {
  userEmail: string;
  location: string;
  password: string;
  userInfo: {
    userName: string;
    userAvatarUrl?: string;
  };
}) {
  const { userEmail, location, password, userInfo } = req;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const userId = await db.collection<User>("User").insertOne({
    userEmail: userEmail,
    location: location,
    password: passwordHash,
    userInfo: userInfo,
  });
}

export async function generateOTPUser(email: string, params: string) {
  let clientId: ObjectId, clientEmail: string;
  if (params === "user") {
    const { userId, userEmail } = await getUser(email);
    clientId = userId;
    clientEmail = userEmail;
  } else if (params === "dealership") {
    const { dealershipId, dealershipEmail } = await getDealership(email);
    clientId = dealershipId;
    clientEmail = dealershipEmail;
  }
  //   if (clientId && clientEmail) {
  //       const prevOTP = await getOTP(email);
  //       if(prevOTP && prevOTP._id)
  //   }
}

export async function getOTP(clientEmail: string) {
  const otpData = await db
    .collection<ResetPasswordOTP>("ResetPasswordOTP")
    .findOne({ clientEmail: clientEmail });
  return otpData;
}

export async function deleteOTP(id: ObjectId) {
  await db
    .collection<ResetPasswordOTP>("ResetPasswordOTP")
    .deleteOne({ id: id });
}

// export async function modifyPassword(id: string, newPassword: string, params) {
//   const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);
//     if (params === "user") {
//         await db.collection<User>("User").updateOne({ id:});
//     }

// }

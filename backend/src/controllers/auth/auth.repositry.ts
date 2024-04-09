import bcrypt from "bcrypt";
import { db } from "../../db";
import { Dealership, ResetPasswordOTP, User } from "../../models";
import { ObjectId, WithId } from "mongodb";
import { generateOTP } from "./auth.utils";

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

export async function verifyUserLogin(email: string, password: string) {
  const user: WithId<User> = await getUser(email);
  if (!user) return null;
  const passwordIsValid = await bcrypt.compare(password, user.password);
  return passwordIsValid ? user : null;
}

export async function verifyDealershipLogin(email: string, password: string) {
  const dealership: WithId<Dealership> = await getDealership(email);
  if (!dealership) return null;
  const passwordIsValid = await bcrypt.compare(password, dealership.password);
  return passwordIsValid ? dealership : null;
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
    role: "USER",
  });
}

export async function generateOTPClient(email: string, clientType: string) {
  let clientId: ObjectId;
  let clientEmail: string;

  if (clientType === "user") {
    const user = await getUser(email);
    if (user) {
      clientId = user._id;
      clientEmail = user.userEmail;
    } else {
      throw new Error("User not found");
    }
  } else if (clientType === "dealership") {
    const dealership = await getDealership(email);
    if (dealership) {
      clientId = dealership._id;
      clientEmail = dealership.dealershipEmail;
    } else {
      throw new Error("Dealership not found");
    }
  } else {
    throw new Error("Invalid client type");
  }

  if (clientId && clientEmail) {
    const prevOTP = await getOTP(email);
    if (prevOTP && prevOTP.reset_otp) {
      await deleteOTP(prevOTP._id);
    }
    const reset_otp = await generateOTP();
    const currTime = new Date();
    const expires_in = new Date(currTime.getTime() + 5 * 60000);
    await db.collection<ResetPasswordOTP>("ResetPasswordOTP").insertOne({
      clientEmail: clientEmail,
      clientId: clientId,
      reset_otp: reset_otp,
      expires_in: expires_in,
    });
    return reset_otp;
  }
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
    .deleteOne({ _id: id });
}

export async function modifyPassword(
  id: ObjectId,
  newPassword: string,
  clientType: string
) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  if (clientType === "user") {
    await db.collection<User>("User").updateOne(
      { _id: id },
      {
        $set: { password: hashedPassword },
      }
    );
  } else if (clientType === "dealership") {
    await db.collection<Dealership>("Dealership").updateOne(
      { _id: id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
  }
}

export async function addDealership(req: {
  dealershipEmail: string;
  dealershipLocation: string;
  password: string;
  dealershipInfo: {
    dealershipName: string;
    dealershipAvatarUrl?: string;
  };
}) {
  const { dealershipEmail, dealershipInfo, password, dealershipLocation } = req;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const dealershipId = await db.collection<Dealership>("Dealership").insertOne({
    dealershipEmail: dealershipEmail,
    dealershipLocation: dealershipLocation,
    password: passwordHash,
    dealershipInfo: dealershipInfo,
    role: "DEALERSHIP",
  });
}

import { Request, Response } from "express";
import {
  verifyUserLogin,
  verifyDealershipLogin,
  getUser,
  addUser,
  getDealership,
  generateOTPClient,
  getOTP,
  deleteOTP,
  modifyPassword,
  addDealership,
} from "./auth.repositry";
import {
  createAccessToken,
  createRefreshToken,
  setRefreshCookie,
  verifyToken,
  setResetPasswordCookie,
  createResetPasswordAccessToken,
} from "./auth.utils";
import { Dealership, User } from "@/models/index";
import { WithId } from "mongodb";
import nodemailer from "nodemailer";
import { APP_PASSWORD, MY_EMAIL } from "@/config/index";

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { userEmail, password, location, userInfo } = req.body as User;
    const user = await getUser(userEmail);
    if (user)
      return res
        .status(409)
        .send({ data: null, error: "Email already exists" });
    await addUser({ userEmail, password, location, userInfo });
    res
      .status(200)
      .send({ data: { message: "Successfully signed up" }, error: null });
  } catch (error) {
    res.status(400).send({ data: null, error: "Something went wrong" });
  }
};

export const dealershipRegister = async (req: Request, res: Response) => {
  try {
    const { dealershipEmail, password, dealershipInfo, dealershipLocation } =
      req.body as Dealership;
    const dealership = await getDealership(dealershipEmail);
    if (dealership) {
      return res
        .status(409)
        .send({ data: null, error: "Email already exists" });
    }
    await addDealership({
      dealershipEmail,
      password,
      dealershipInfo,
      dealershipLocation,
    });
    res
      .status(200)
      .send({ data: { message: "Successfully signed up" }, error: null });
  } catch (error) {
    res.status(400).send({ data: null, error: "Something went wrong" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await verifyUserLogin(email, password);
    if (!user)
      return res
        .status(401)
        .send({ data: null, error: "Invalid Email or Password" });
    const accessToken = createAccessToken(
      user._id,
      user.userEmail,
      user.userInfo.userName,
      user.role
    );
    const refreshToken = createRefreshToken(
      user._id,
      user.userEmail,
      user.userInfo.userName,
      user.role
    );
    setRefreshCookie(res, refreshToken);
    res.status(200).send({ accessToken });
  } catch (error) {
    res.status(400).send({ data: null, error: "Something went wrong" });
  }
};

export const dealershipLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const dealership = await verifyDealershipLogin(email, password);
    if (!dealership)
      return res
        .status(401)
        .send({ data: null, error: "Invalid Email or Password" });
    const accessToken = createAccessToken(
      dealership._id,
      dealership.dealershipEmail,
      dealership.dealershipInfo.dealershipName,
      dealership.role
    );
    const refreshToken = createRefreshToken(
      dealership._id,
      dealership.dealershipEmail,
      dealership.dealershipInfo.dealershipName,
      dealership.role
    );
    setRefreshCookie(res, refreshToken);
    res.status(200).send({ accessToken });
  } catch (error) {
    res.status(400).send({ data: null, error: "Something went wrong" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { id, name, email, role } = verifyToken(refreshToken);
    const accessToken = createAccessToken(id, name, email, role);
    res.status(200).send({ accessToken });
  } catch (error) {
    res.status(400).send({ data: null, error: "Invalid refresh token" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken");
    res
      .status(200)
      .send({ data: { message: "User logged out successfully" }, error: null });
  } catch (error) {
    res.status(400).send({ data: null, error: "Log out failed" });
  }
};

export const checkEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const clientType = req.params.clientType;

    let client: WithId<User> | WithId<Dealership>;
    if (clientType === "user") {
      client = await getUser(email);
    } else if (clientType === "dealership") {
      client = await getDealership(email);
    }
    if (!client)
      res.status(401).send({ data: null, error: "Email does not exists" });
    res.status(200).send({
      data: {
        message: "Client Exists",
      },
      error: null,
    });
  } catch (error) {
    res.status(401).send({ data: null, error: "Email does not exists" });
  }
};

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const tranporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: MY_EMAIL,
        pass: APP_PASSWORD,
      },
    });

    const { email } = req.body;
    const clientType = req.params.clientType;
    const OTP = await generateOTPClient(email, clientType);
    const mailOptions = {
      from: MY_EMAIL,
      to: email,
      subject: "PASSWORD RESET",
      html: `<html>
             <body>
               <h2>Password Recovery</h2>
               <p>Use this OTP to reset your password. OTP is valid for 1 minute</p>
               <h3>${OTP}</h3>
             </body>
           </html>`,
    };
    tranporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({
          data: null,
          error: "An error occured while sending the Email",
        });
      } else {
        res
          .status(200)
          .send({ data: { message: "Email sent successfully" }, error: null });
      }
    });
  } catch (error) {
    res
      .status(500)
      .send({ data: null, error: "An error occured while sendig the Email" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { otp, email } = req.body;
    const clientOTP = await getOTP(email);
    const currTime = new Date();
    if (!clientOTP)
      return res.status(410).send({ data: null, error: "OTP does not exist" });
    if (clientOTP.expires_in > currTime) {
      if (clientOTP.reset_otp == otp) {
        await deleteOTP(clientOTP._id);
        const accessToken = createResetPasswordAccessToken(
          clientOTP._id,
          email
        );
        setResetPasswordCookie(res, accessToken);
        res.status(200).send({
          data: { message: "User verified", accessToken },
          error: null,
        });
      } else {
        res.status(401).send({ data: null, error: "OTP is incorrect" });
      }
    } else {
      res.status(410).send({ data: null, error: "OTP is expired" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: null, error: "Internal server error" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { newPassword, email } = req.body;
    const clientType = req.params.clientType;
    let client: WithId<User> | WithId<Dealership>;
    if (clientType === "user") {
      client = await getUser(email);
    } else if (clientType === "dealership") {
      client = await getDealership(email);
    }
    const id = client._id;
    await modifyPassword(id, newPassword, clientType);
    res.clearCookie("resetPasswordToken");
    return res.status(200).send({
      data: { message: "Password successfully updated" },
      error: null,
    });
  } catch (error) {
    return res.status(200).send({
      data: null,
      error: "Cannot update the user",
    });
  }
};

import { Request, Response } from "express";
import { verifyLogin, getUser, addUser } from "./auth.repositry";
import {
  createAccessToken,
  createRefreshToken,
  setRefreshCookie,
  verifyToken,
} from "./auth.utils";
import { User } from "../../models";

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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await verifyLogin(email, password);
    // console.log(user);
    if (!user)
      return res
        .status(401)
        .send({ data: null, error: "Invalid Email or Password" });
    const accessToken = createAccessToken(
      user.userId,
      user.userEmail,
      user.userInfo.userName
    );
    const refreshToken = createRefreshToken(
      user.userId,
      user.userEmail,
      user.userInfo.userName
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
    const { id, name, email } = verifyToken(refreshToken);
    const accessToken = createAccessToken(id, name, email);
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

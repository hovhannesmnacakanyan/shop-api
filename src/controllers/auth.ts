import { Request, Response, NextFunction } from "express";
import { generateAuthToken } from "../utils/jwt";
import userModel from "../models/user";

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const isUserExist = await userModel.findUserByUsername(username);

    if (!isUserExist) {
      return res.status(404).send({ message: "User not exist" });
    }

    const isValidPass = await isUserExist.validPassword(password);

    if (!isValidPass) {
      return res.send("Invalid password");
    }

    const userId = isUserExist._id.toString();
    const token = generateAuthToken({ role: "user", id: userId });

    res.status(200).json({ token, role: "user" });
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const { ADMIN_USERNAME, ADMIN_PASS } = process.env;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASS) {
      return res.status(400).json({ message: "wrong username or password" });
    }

    const token = generateAuthToken({ role: "admin" });
    res.status(200).json({ token, role: "admin" });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const { ADMIN_USERNAME, ADMIN_PASS } = process.env;

    if (username === ADMIN_USERNAME && password === ADMIN_PASS) {
      return adminLogin(req, res, next);
    }

    return userLogin(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.body;
    const isUserExist = await userModel.findUserByUsername(username);

    if (isUserExist) {
      return res.status(422).send({ message: "User already exist" });
    }

    await userModel.register(req.body);
    res.json({ message: "User created" });
  } catch (error) {
    next(error);
  }
};

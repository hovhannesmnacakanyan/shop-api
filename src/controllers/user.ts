import { Request, Response, NextFunction } from "express";
import userModel from "../models/user";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userModel.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

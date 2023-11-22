import { IReqUser } from "controllers/order";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const { JWT_PRIVATE_KEY } = process.env;

const verifyToken = async (req: Request) => {
  let token = req.headers.authorization;

  if (!token) {
    throw new Error("authMessages.NO_TOKEN");
  }

  token = token?.split(" ")[1];
  const decoded = jwt.verify(token, JWT_PRIVATE_KEY);

  return decoded;
};

export const auth = async (
  req: IReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const decoded = await verifyToken(req);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const user = async (
  req: IReqUser,
  res: Response,
  next: NextFunction
) => {
  const decoded = await verifyToken(req);

  if (decoded?.role === "user") {
    req.user = decoded;
    next();
  } else {
    res.status(401).json({ message: "Invalid role" });
  }
};

export const admin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const decoded = await verifyToken(req);

  if (decoded?.role !== "admin") {
    return res.status(403).json({ message: "authMessages.ADMIN_PERMISSIONS" });
  }

  next();
};

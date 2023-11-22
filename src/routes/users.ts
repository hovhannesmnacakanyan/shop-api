import express from "express";
const router = express.Router();

import { userController } from "../controllers";
import { auth, admin } from "../middlewares/auth";

router.get("/", [auth, admin], userController.getUsers);

export default router;

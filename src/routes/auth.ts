import express from "express";
const router = express.Router();
import { validators, validateBody } from "../utils/validations";
import { authController } from "../controllers";

router.post(
  "/login",
  validateBody(validators.userPayload),
  authController.login
);

router.post(
  "/register",
  validateBody(validators.userPayload),
  authController.register
);

export default router;

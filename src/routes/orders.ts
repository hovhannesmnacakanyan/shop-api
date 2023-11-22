import express from "express";
const router = express.Router();
import { validators, validateBody } from "../utils/validations";

import { auth, user } from "../middlewares/auth";
import { orderController } from "../controllers";

router.post(
  "/",
  [auth, user],
  validateBody(validators.orderPayload),
  orderController.createOrder
);

router.get("/", [auth], orderController.getOrders);

export default router;

import express from "express";
const router = express.Router();
import { validators, validateBody } from "../utils/validations";

import { auth, admin } from "../middlewares/auth";
import { productController } from "../controllers";

router.get("/", productController.getProducts);

router.post(
  "/",
  [auth, admin],
  validateBody(validators.productPayload),
  productController.createProduct
);

router.put(
  "/:id",
  validateBody(validators.productPayload),
  productController.getProducts
);

export default router;

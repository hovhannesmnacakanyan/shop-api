import { Request, NextFunction, Response } from "express";
import orderModel from "../models/order";
import productModel from "../models/product";

export interface IReqUser extends Request {
  user: { id?: string; role: string };
}

export const createOrder = async (
  req: IReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const { products } = req.body;
    let total = 0;

    for (const productData of products) {
      const product = await productModel.getProductById(productData.productId);
      if (!product) {
        throw new Error(`Product ${product} not found`);
      } else {
        total += product.price * productData.quantity;
      }
    }

    req.body.totalPrice = total;
    req.body.userId = id;

    const createdProduct = await orderModel.createOrder(req.body);
    res.json(createdProduct);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: IReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      user,
      query: { username },
    } = req;
    let orders = [];

    if (user.role === "user") {
      orders = await orderModel.getUserOrders(user.id);
    } else {
      orders = await orderModel.getOrders(username as string);
    }

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

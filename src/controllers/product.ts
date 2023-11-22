import productModel from "../models/product";
import { Request, Response, NextFunction } from "express";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const isProductExist = await productModel.findProductByName(name);

    if (isProductExist) {
      return res.status(422).send("Product already exist");
    }

    const createdProduct = await productModel.createProduct(req.body);
    res.json(createdProduct);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.query;

  try {
    const products = await productModel.getProducts(name as string);

    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const updateProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const products = await productModel.updateProduct(id, data);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

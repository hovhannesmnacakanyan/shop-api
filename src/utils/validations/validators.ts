import Joi from "joi";

const name = Joi.string().min(2).max(50);
const price = Joi.number().min(0).max(9999);
const password = Joi.string().min(6).max(50);

const orderProductSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const userPayload = Joi.object({
  password: password.required(),
  username: name.required(),
});

export const productPayload = Joi.object({
  name: name.required(),
  price: price.required(),
});

export const orderPayload = Joi.object({
  products: Joi.array().items(orderProductSchema).min(1).required(),
});

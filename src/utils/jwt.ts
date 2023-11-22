import jwt from "jsonwebtoken";
const { JWT_PRIVATE_KEY } = process.env;

export const generateAuthToken = (obj) => {
  const token = jwt.sign(obj, JWT_PRIVATE_KEY);

  return token;
};

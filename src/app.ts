import cors from "cors";
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import {
  authRoutes,
  usersRoutes,
  productsRoutes,
  ordersRoutes,
} from "./routes";
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//middleware
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "not found" });
  next();
});

app.use(((err, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err?.message });
  next();
}) as ErrorRequestHandler);

module.exports = app;

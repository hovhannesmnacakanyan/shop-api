require("dotenv").config();
import mongoose from "mongoose";
const app = require("./app");
const { MONGODB_URI, PORT = 8080 } = process.env;

mongoose
  .connect(MONGODB_URI, {})
  .then(() => {
    console.log("mongodb connected successfully");
    app.listen(PORT, () => {
      console.log("Server is running on port: ", PORT);
    });
  })
  .catch((err) => {
    console.log("FATAL error: " + err.message);
    process.exit(1);
  });

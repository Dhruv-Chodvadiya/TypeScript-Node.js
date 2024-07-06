import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB: string = process.env.DB || "mongodb://localhost:27017/TS";

export const connectDb = () => {
  return mongoose.connect(DB);
};

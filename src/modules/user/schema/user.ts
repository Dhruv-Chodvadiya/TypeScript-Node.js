import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
    required: true,
  },
});

export const userModel = mongoose.model<IUser>("user", UserSchema);
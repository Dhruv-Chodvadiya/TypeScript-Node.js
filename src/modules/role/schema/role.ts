import mongoose, { Schema, model } from "mongoose";
import { IRole } from "../types";

const roleSchema: Schema<IRole> = new Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: {
    type: [String],
    required: true,
  },
});

export const roleModel = model<IRole>("role", roleSchema);

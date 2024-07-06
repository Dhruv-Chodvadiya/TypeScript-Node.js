import mongoose, { Schema, model } from "mongoose";
import { ITask } from "../types";

const taskSchema = new Schema<ITask>({
  taskName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  taskStatus: {
    type: String,
    default: "Pending",
  },
  requireTime: {
    type: String,
  },
  taskDate: {
    type: Date,
    default: Date.now(),
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "user", // Reference to the 'User' model
    required: true,
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: "user", // Reference to the 'User' model
    required: true,
  },
});

export const taskModel = model<ITask>("task", taskSchema);

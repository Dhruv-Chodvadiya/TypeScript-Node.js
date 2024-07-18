import { taskModel } from "./schema";
import { ITask } from "./types";

export const deleteTask = async (_id: string) => {
  const deleteTask = await taskModel.findByIdAndDelete(_id);
  return deleteTask as ITask;
};
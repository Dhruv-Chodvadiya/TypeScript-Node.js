import { taskModel } from "./schema";
import { ITask } from "./types";

export const getOneTask = async (query: Object) => {
  const getOneTask = await taskModel.findOne(query);
  return getOneTask as ITask;
};
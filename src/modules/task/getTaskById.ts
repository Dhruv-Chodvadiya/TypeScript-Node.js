import { taskModel } from "./schema";
import { ITask } from "./types";

export const getTaskById = async (_id: string) => {
  const taskFindById = await taskModel.findById(_id).lean();
  return taskFindById as ITask;
};

import { taskModel } from "./schema";
import { ITask, Task } from "./types";

export const updateTask = async (task: Task) => {
  const updateTask = await taskModel.findByIdAndUpdate(task._id, task.toJSON());
  return updateTask as ITask;
};
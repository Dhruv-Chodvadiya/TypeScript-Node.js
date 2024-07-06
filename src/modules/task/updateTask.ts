import { taskModel } from "./schema";
import { ITask, Task } from "./types";

/* export const updateTask = async (_id: string, query: Object) => {
  const updateTask = await taskModel.findByIdAndUpdate(_id, query, { new: true });
  return updateTask as ITask;
}; */

export const updateTask = async (task: Task) => {
  const updateTask = await taskModel.findByIdAndUpdate(task._id, task.toJSON());
  return updateTask as ITask;
};
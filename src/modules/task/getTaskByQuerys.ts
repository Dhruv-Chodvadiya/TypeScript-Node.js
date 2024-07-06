import { taskModel } from "./schema";
import { ITask } from "./types";

export const getTaskByQuery = async (query: Object) => {
    const getTaskByQuery = await taskModel.find(query, { _id: 0, __v: 0 })
        .populate({
        path: "assignedTo",
        select: "-_id -password -__v",
        populate: {
          path: "role",
          model: "role",
          select: "-_id -permissions -__v",
        },
      })
      .populate({
        path: "assignedBy",
        select: "-_id -__v -password -email",
        populate: {
          path: "role",
          model: "role",
          select: "-_id -__v -permissions",
        },
      });
  return getTaskByQuery as ITask[];
};
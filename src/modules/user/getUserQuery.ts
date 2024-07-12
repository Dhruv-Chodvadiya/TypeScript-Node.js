import { userModel } from "./schema";
import { IUser } from "./types";

export const getUserQuery = async (query: Object) => {
  const userFindQuery = await userModel
    .find(query, { _id: 0, __v: 0, password: 0 })
    .populate("role", "-_id -permissions -__v");
  return userFindQuery as IUser[];
};
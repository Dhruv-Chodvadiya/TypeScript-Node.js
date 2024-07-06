import { userModel } from "./schema";
import { IUser } from "./types";

export const getOneUser = async (query: Object) => {
  const getOneUser = await userModel.findOne(query);
  return getOneUser as IUser;
};
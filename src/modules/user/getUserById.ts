import { userModel } from "./schema";
import { IUser } from "./types";

export const getUserById = async (_id: string) => {
  const userFindById = await userModel.findById(_id).lean();
  return userFindById as IUser;
};

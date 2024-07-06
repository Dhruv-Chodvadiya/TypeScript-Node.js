import { userModel } from "./schema";
import { IUser } from "./types";

export const deleteUser = async (_id: string) => {
  const deleteUser = await userModel.findByIdAndDelete(_id);
  return deleteUser as IUser;
};
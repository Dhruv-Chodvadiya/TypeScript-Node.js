import { userModel } from "./schema";
import { User } from "./types";

/* export const updateUser = async (_id: string, query: Object) => {
  const updateUser = await userModel.findByIdAndUpdate(_id, query);
  return updateUser as IUser;
}; */

export const updateUser = async (user: User) => {
  
  const updateUser = await userModel.findByIdAndUpdate(user._id, user.toJSON());
  return updateUser;
};

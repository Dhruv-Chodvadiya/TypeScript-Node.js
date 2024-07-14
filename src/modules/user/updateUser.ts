import { userModel } from "./schema";
import { User } from "./types";

export const updateUser = async (user: User) => {
  const updateUser = await userModel.findByIdAndUpdate(user._id, user.toJSON());
  return updateUser;
};

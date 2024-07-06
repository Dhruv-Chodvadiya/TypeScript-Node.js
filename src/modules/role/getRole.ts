import { roleModel } from "./schema";
import { IRole } from "./types";

export const getRole = async () => {
  const getAllRole = await roleModel.find();
  return getAllRole as IRole[];
};

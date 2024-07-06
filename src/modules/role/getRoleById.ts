import { roleModel } from "./schema";
import { IRole } from "./types";

export const getRoleById = async (_id: string) => {
  const roleFindById = await roleModel.findById(_id);
  return roleFindById as IRole;
};

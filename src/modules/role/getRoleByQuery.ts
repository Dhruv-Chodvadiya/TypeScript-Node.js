import { roleModel } from "./schema";
import { IRole } from "./types";

export const getRoleByQuery = async (query: Object) => {
  const getRoleByQuery = await roleModel.find(query);
  return getRoleByQuery as IRole[];
};

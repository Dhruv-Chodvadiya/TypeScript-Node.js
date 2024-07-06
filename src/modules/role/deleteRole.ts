import { roleModel } from "./schema";

export const deleteRole = async (_id: string) => {
  await roleModel.findByIdAndDelete(_id);
  return ;
};
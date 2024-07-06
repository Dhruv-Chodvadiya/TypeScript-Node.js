import { Role } from "./types";
import { roleModel } from "./schema";

/* export const updateRole = async (_id: string, updateObj: Object) => {
    const reqPermission: string[] = [
        ...new Set<string>(role.permissions),
    ];
    let updateObj: {
        roleName?: string;
        $addToSet?: { permissions: { $each: string[] } };
      } = {};

      if (role.roleName) {
        updateObj.roleName = role.roleName;
      }

      if (role.permissions && role.permissions.length > 0) {
        updateObj.$addToSet = { permissions: { $each: reqPermission } };
      }
  
      const updateRole = await roleModel.findByIdAndUpdate(_id, updateObj,{ new: true } );
    
    return updateRole;
} */

export const updateRole = async (updateObj: Role) => {
  /* const reqPermission: string[] = [
      ...new Set<string>(role.permissions),
  ];
  let updateObj: {
      roleName?: string;
      $addToSet?: { permissions: { $each: string[] } };
    } = {};

    if (role.roleName) {
      updateObj.roleName = role.roleName;
    }

    if (role.permissions && role.permissions.length > 0) {
      updateObj.$addToSet = { permissions: { $each: reqPermission } };
    } */
  

  console.log(updateObj);

    //const updateRole = await roleModel.findByIdAndUpdate(_id, updateObj,{ new: true } );
  
  return updateRole;
}
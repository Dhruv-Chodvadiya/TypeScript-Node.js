import { Response } from "express";
import { Request } from "../../request";
import Joi, { ValidationResult, object } from "joi";
import {
  Role,
  roleModel,
  IRole,
  getRoleById,
  getRole,
  deleteRole,
  updateRole,
  getRoleByQuery,
} from "../../modules/role";

export default class Controller {
  protected verifyRoleSchema = Joi.object({
    roleName: Joi.string().pattern(new RegExp("^[a-zA-Z]")).required(),
    permissions: Joi.array().items(Joi.string()).required().min(1).messages({
      "any.required": "Permissions are required",
      "array.min": "At least one permission is required",
    }),
  });

  protected verifyBulkRoleSchema = Joi.array().items(this.verifyRoleSchema);

  protected get = async (req: Request, res: Response) => {
    try {
      const getAllRole: IRole[] = await getRole();

      res.status(200).json({
        getAllRole,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        message: error.message || "Error retrieving roles",
      });
    }
  };

  protected create = async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        return res.status(400).json({
          message: "Request body is missing",
        });
      }

      if (!Array.isArray(req.body)) {
        req.body = [req.body];
      }

      const { error, value } = this.verifyBulkRoleSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          message: error,
        });
      }

      const existingRoles = await getRoleByQuery({
        roleName: { $in: req.body.map((role: IRole) => role.roleName) },
      });

      if (existingRoles.length > 0) {
        const existingRoleNames = existingRoles.map((role) => role.roleName);
        return res.status(400).json({
          error: `Roles already exist: ${existingRoleNames.join(", ")}`,
        });
      }

      await roleModel.insertMany(req.body);

      res.status(200).json({
        message: "Roles created successfully",
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        message: error.message,
      });
    }
  };

  protected update = async (req: Request, res: Response) => {
    try {

      const role: IRole = await getRoleById(req.params.roleId);

      if (!role) {
        return res.status(404).json({
          message: "Check your Role ID",
        });
      }

      const reqPermission: string[] = [
        ...new Set<string>(req.body.permissions),
      ];


      let updateObj: {
        roleName?: string;
        permissions?: string;
        $addToSet?: { permissions: { $each: string[] } };
      } = {};

      if (req.body.roleName) {
        updateObj.roleName = req.body.roleName;
      }

      if (req.body.permissions && req.body.permissions.length > 0) {
        const addPermissions = `$addToSet = { permissions: { $each: reqPermission } }`
        console.log(typeof addPermissions);
        updateObj.permissions = addPermissions;
      }

      req._id = req.params.roleId;

      const updatedRole = await updateRole(new Role(req._id, updateObj));

      if (!updatedRole) {
        return res.status(404).json({
          message: "Role not found or update failed",
        });
      }

      res.status(200).json({
        message: "Update successfully",
        updatedRole,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        message: error.message,
      });
    }
  };

  protected removePermission = async (req: Request, res: Response) => {
    try {
      const role: IRole = await getRoleById(req.params.roleId);

      if (!role) {
        return res.status(404).json({
          message: "Check your Role ID",
        });
      }

      const exist: boolean = req.body.permissions.every((pm: string) =>
        role.permissions?.includes(pm)
      );

      if (!exist) {
        return res.status(404).json({
          message: "Some permissions are not found in the role",
        });
      }

      /* const updateDetails = (await updateRole(reqID, {
        $pull: { permissions: { $in: req.body.permissions } },
      })) as IRole;

      if (!updateDetails) {
        return res.status(404).json({
          message: "Role not found or update failed",
        });
      } */

      res.status(200).json({
        message: "remove Permission successfully",
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        message: error.message,
      });
    }
  };

  protected delete = async (req: Request, res: Response) => {
    try {
      const role: IRole = await getRoleById(req.params.roleId);

      if (!role) {
        return res.status(404).json({
          message: "Check your Role ID",
        });
      }

      await deleteRole(req.params.roleId);

      res.status(200).json({
        message: "Delete Role successfully",
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        message: error.message,
      });
    }
  };
}
import { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { userModel, IUser } from "../modules/user";
import { roleModel, IRole } from "../modules/role";
import { Request } from "../request";

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData: any = req.tokenData;

      const findUser: IUser = (await userModel.findOne({
        email: tokenData?.email,
      })) as IUser;
      if (!findUser) {
        return res.status(403).json({
          message: "User not found or invalid token",
        });
      }

      const findRole: IRole = (await roleModel.findOne({
        _id: findUser.role,
      })) as IRole;
      if (!findRole) {
        return res.status(403).json({
          message: "Role not found for the user",
        });
      }

      if (findRole.permissions?.includes(requiredPermission)) {
        next();
      } else {
        res.status(403).json({
          message: "You do not have the necessary permissions",
        });
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  };
};

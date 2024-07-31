import { Response } from "express";
import { Request } from "../../request";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { sendMail } from "../../helper";
import Joi, { ValidationResult, object } from "joi";
import { roleModel, IRole, getRoleById } from "../../modules/role";
import { userModel, IUser, getUserById, getUserQuery, deleteUser, getOneUser, updateUser, User } from "../../modules/user";
import { PassThrough } from "stream";

export default class Controller {
  protected verifyUserSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 1, tlds: { allow: ["com"] } })
      .pattern(/^[^A-Z*/+\-]+@[^A-Z*/+\-]+\.[^A-Z*/+\-]+$/)
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    role: Joi.string().required(),
  });

  protected verifyUpdateUserSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    role: Joi.string(),
  });

  protected logIn = async (req: Request, res: Response) => {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      const user = (await getOneUser({ email: email })) as IUser;

      if (!user) {
        return res.status(400).json({
          message: "Invalid Email and Password",
        });
      }

      const match: boolean = await bcrypt.compare(password, user.password);

      if (match) {
        const token: string = jwt.sign(
          {
            id: user._id,
            email: user.email,
          },
          process.env.SECRET_KEY || "jwtSecretKey"
        );

        res.header("Authorization", `${token}`);
      } else {
        return res.status(400).json({
          message: "Invalid Email and Password",
        });
      }

      return res.status(200).json({
        message: "Log In successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };

  protected get = async (req: Request, res: Response) => {
    try {

      const tokenDetails = (await getUserById(req.tokenData?.id)) as IUser;

      if (!tokenDetails) {
        return res.status(404).json({ message: "User not found" });
      }

      const role = (await getRoleById(tokenDetails.role.toString())) as IRole;

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      let getUserData: IUser[] = [];

      if (role.roleName === "superadmin") {
        getUserData = await getUserQuery({});
      } else if (role.roleName === "Admin") {
        const getAllUser: IUser[] = await getUserQuery({});
        getUserData = getAllUser.filter(user => (user.role).roleName === 'Employee');
      }

      res.status(200).json({
        getUserData
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };

  protected create = async (req: Request, res: Response) => {
    try {
      const validateUser = (
        req: Request
      ): { error: Error | null; value: IUser } => {
        const { error, value } = this.verifyUserSchema.validate(req.body);

        if (error) {
          return { error, value };
        }

        return { error: null, value: value as IUser };
      };

      const { error, value } = validateUser(req.body);

      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      const { name, email, password, role }: IUser = req.body;

      const beforePassword = password;

      const existRole = (await getRoleById(role.toString())) as IRole;

      if (!existRole) {
        return res.status(404).json({
          message: "Role not found",
        });
      }

      const validEmail = (await getOneUser({ email })) as IUser;

      if (validEmail) {
        return res.status(409).json({
          message: "Email is already in use",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await userModel.create({ name, email, password: hashedPassword, role });

      const msg = `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333;">Hi ${name},</h1>
                        <p style="color: #666;">You have been added as a ${existRole.roleName}.</p>
                        <p style="color: #666;">Your login credentials are:</p>
                        <ul>
                            <li><strong>Email:</strong> ${email}</li>
                            <li><strong>Password:</strong> ${beforePassword}</li>
                        </ul>
                        <p style="color: #666;">Please change your password after logging in.</p>
                        <p style="color: #666;">Best regards,<br>Company</p>
                    </div>
                </div>
            `;

      sendMail({ email, subject: "Welcome to the Company", content: msg });

      res.status(200).json({
        message: "User created successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };

  protected update = async (req: Request, res: Response) => {
    try {
      const { error, value } = this.verifyUpdateUserSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const user: IUser = await getUserById(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: "User ID not found" });
      }

      if (value.password) {
        const match: boolean = await bcrypt.compare(
          value.password,
          user.password
        );
        if (match) {
          return res.status(400).json({
            message: "New password cannot be the same as old password",
          });
        }
      }

      if (value.name) {
        if (value.name === user.name) {
          return res.status(400).json({
            message: "New Name cannot be the same as old Name",
          });
        }
      }

      if (value.email) {
        if (value.email === user.email) {
          return res.status(400).json({
            message: "New Email cannot be the same as old Email",
          });
        }
      }

      let newMail = value.email ? value.email : user.email;

      let roleName: string | undefined;

      if (value.role) {
        // Find role details by ID
        const roleDetails: IRole = await getRoleById(value.role);
        if (!roleDetails) {
          return res.status(404).json({ message: "Role not found" });
        }
        roleName = roleDetails.roleName as string;
      }

      let updateObj: Partial<IUser> = {};

      if (value.name) {
        updateObj.name = value.name;
      }
      if (value.email) {
        updateObj.email = value.email;
      }
      if (value.password) {
        const hashedPassword = await bcrypt.hash(value.password, 10);

        updateObj.password = hashedPassword;
      }
      if (value.role) {
        updateObj.role = value.role;
      }
      
      // Update user document
      await updateUser(new User({ ...user, ...value, password: updateObj.password}));

      // Construct update message for email
      let updateStr = "";
      for (const key in updateObj) {
        if (key === "role" && roleName) {
          updateStr += `<p>Role: ${roleName}</p>`;
        } else if (key === "password") {
          updateStr += `<p>New Password: ${value.password}</p>`;
        } else {
          updateStr += `<p>${key}: ${updateObj[key as keyof IUser]}</p>`;
        }
      }

      const msg = `<p>Hi ${user.name},</p>
            <p>Your details have been updated as follows:</p>
            ${updateStr}
            <p>Best regards,<br>Company</p>`;

      // Send email notification
      sendMail({
        email: newMail,
        subject: "Your Details Have Been Updated",
        content: msg,
      });

      res.status(200).json({ message: "Update successful" });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };

  protected delete = async (req: Request, res: Response) => {
    try {
      const reqID: string = req.params.userId;

      // Find user by ID
      const user: IUser = await getUserById(reqID);

      // Handle case where user is not found
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Delete user by ID
      await deleteUser(reqID);

      // Send success response
      res.status(200).json({
        message: "Delete User successfully",
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };
}
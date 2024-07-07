import { Response } from "express";
import { Request } from "../../request";
import { JwtPayload } from "jsonwebtoken";
import Joi from "joi";
import { userModel, IUser, getUserById } from "../../modules/user";
import { roleModel, IRole, getRoleById } from "../../modules/role";
import {
  taskModel,
  ITask,
  getTaskById,
  getTaskByQuery,
  getOneTask,
  deleteTask,
  updateTask,
  Task,
} from "../../modules/task";

export default class Controller {
  protected verifyTaskSchema = Joi.object({
    taskName: Joi.string().required(),
    description: Joi.string().required(),
    assignedTo: Joi.string().required(), // Assuming assignedTo is a string (user ID)
  });

  protected getTaskAssignBy = async (req: Request, res: Response) => {
    try {
      const tokenDetails: IUser = await getUserById(req.tokenData.id);

      if (!tokenDetails) {
        return res.status(404).json({ message: "User not found" });
      }

      const role: IRole = await getRoleById(tokenDetails.role.toString());

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      let getAllTask: ITask[] = [];

      if (role.roleName === "Super Admin") {
        getAllTask = await getTaskByQuery({});
      } else {
        getAllTask = await getTaskByQuery({
          assignedBy: { $in: tokenDetails._id },
        });
      }

      res.status(200).json({
        message: "Tasks retrieved successfully",
        getAllTask,
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };

  protected getTaskAssignTo = async (req: Request, res: Response) => {
    try {
      const tokenDetails: IUser = await getUserById(req.tokenData.id);

      if (!tokenDetails) {
        return res.status(404).json({ message: "User not found" });
      }

      const role: IRole = await getRoleById(tokenDetails.role.toString());

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      let getAllTask: ITask[] = [];

      if (role.roleName === "superadmin") {
        getAllTask = await getTaskByQuery({});
      } else {
        getAllTask = await getTaskByQuery({
          assignedTo: { $in: tokenDetails._id },
        });
      }
      res.status(200).json({
        message: "Tasks retrieved successfully",
        getAllTask,
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };

  protected assignTask = async (req: Request, res: Response) => {
    try {
      const { error, value } = this.verifyTaskSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const {
        taskName,
        description,
        assignedTo,
      }: { taskName: string; description: string; assignedTo: string } = value;

      // Check if assignedTo is the same as the user's ID from the token
      const tokenData = req.tokenData ; // Type assertion for req.tokenData
      if (tokenData.id === assignedTo) {
        return res
          .status(400)
          .json({ message: "You cannot assign a task to yourself" });
      }

      // Check if the user (assignedTo) exists
      const existUser: IUser = await getUserById(assignedTo);
      if (!existUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if there is already a task with the same name assigned to the user
      const existingTask = (await getOneTask({
        taskName,
        assignedTo,
      })) as ITask;
      if (existingTask) {
        return res.status(400).json({
          message: "Task with the same name already assigned to the user",
        });
      }

      // Create a new task instance
      const newTask = new taskModel({
        ...value,
        assignedBy: tokenData.id,
      });

      // Save the new task to the database
      await newTask.save();

      res.status(200).json({ message: "Task assigned successfully" });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };

  protected updateTaskAssignBy = async (req: Request, res: Response) => {
    try {
      const existTask: ITask = await getTaskById(req.params.taskId);

      if (!existTask) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: "Empty body not allowed",
        });
      }

      if (existTask.assignedBy.toString() !== req.tokenData.id) {
        return res.status(403).json({
          message: "You are not authorized to update this task",
        });
      }

      if (req.body.assignedTo === req.tokenData.id.toString()) {
        return res.status(400).json({
          message: "You cannot assign the task to yourself",
        });
      }

      if (req.body.taskDate) {
        return res.status(400).json({
          message: "Task date cannot be changed",
        });
      }

      if (req.body.taskStatus) {
        return res.status(400).json({
          message: "Task status cannot be changed",
        });
      }

      if (req.body.assignedBy) {
        return res.status(400).json({
          message: "AssignedBy field cannot be changed",
        });
      }

      let allChanges: Partial<ITask> = {};

      if (req.body.taskName) {
        allChanges.taskName = req.body.taskName;
      }
      if (req.body.description) {
        allChanges.description = req.body.description;
      }
      if (req.body.assignedTo) {
        allChanges.assignedTo = req.body.assignedTo;
      }      
      
      const updatedTask = (await updateTask(new Task({...existTask,...allChanges})));

      if (!updatedTask) {
        return res.status(404).json({
          message: "Task not found or update failed",
        });
      }

      res.status(200).json({
        message: "Task updated successfully",
        updatedTask,
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };

  protected updateTaskAssignTo = async (req: Request, res: Response) => {
    try {
      const existTask: ITask = await getTaskById(req.params.taskId);

      if (!existTask) {
        return res.status(404).json({
          message: "Task is not found",
        });
      }

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: "Empty body not allowed",
        });
      }

      if (existTask.assignedTo.toString() !== req.tokenData.id.toString()) {
        return res.status(403).json({
          message: "The task was not assigned to you",
        });
      }

      if (req.body.taskName || req.body.description) {
        return res.status(400).json({
          message: "You cannot change Task Name or Description",
        });
      }

      if (!req.body.taskDate) {
        req.body.taskDate = existTask.taskDate; // Assuming existTask.taskDate is the default value
      }

      if (req.body.assignedTo || req.body.assignedBy) {
        return res.status(400).json({
          message: "You cannot change Assigned To or Assigned By",
        });
      }

      const allChanges: Partial<typeof existTask> = {};

      if (req.body.taskStatus) {
        allChanges.taskStatus = req.body
          .taskStatus as (typeof existTask)["taskStatus"];
      }
      if (req.body.requireTime) {
        allChanges.requireTime = req.body
          .requireTime as (typeof existTask)["requireTime"];
      }

      await updateTask(new Task({ ...existTask, ...allChanges }));

      res.status(200).json({
        message: "Task updated successfully",
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };

  protected delete = async (req: Request, res: Response) => {
    try {
      const existTask: ITask = await getTaskById(req.params.taskId);

      if (!existTask) {
        return res.status(404).json({
          message: "Task is not found",
        });
      }

      if (existTask.assignedBy != req.tokenData.id) {
        return res.status(403).json({
          message: "You are not authorized to delete this task",
        });
      }

      await deleteTask(req.params.taskId);

      res.status(200).json({
        message: "Task deleted successfully",
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  };
}

import { Types } from "mongoose";
import { isUndefined, omitBy } from "lodash";
import { IUser } from "../../user/types";

export interface ITask {
  _id?: string;
  taskName: string;
  description: string;
  taskStatus: string;
  requireTime?: string;
  taskDate: Date;
  assignedTo: Types.ObjectId | IUser;
  assignedBy: Types.ObjectId | IUser;
}

export class Task implements ITask {
  _id?: string;
  taskName: string;
  description: string;
  taskStatus: string;
  requireTime?: string;
  taskDate: Date;
  assignedTo: Types.ObjectId | IUser;
  assignedBy: Types.ObjectId | IUser;

  constructor(input: ITask) {
    this._id =  input?._id ? input?._id.toString() : new Types.ObjectId().toString();
    this.taskName = input.taskName;
    this.description = input.description;
    this.taskStatus = input.taskStatus;
    this.taskDate = input.taskDate;
    this.assignedTo = input.assignedTo;
    this.assignedBy = input.assignedBy;
  }

  toJSON(): ITask {
    return omitBy(this, isUndefined) as ITask;
  }
}

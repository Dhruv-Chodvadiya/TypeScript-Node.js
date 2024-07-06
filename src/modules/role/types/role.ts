import { Types } from "mongoose";
import { isUndefined, omitBy } from "lodash";

export interface IRole{
  _id?: string;
  roleName: string;
  permissions: string[];
}

export class Role implements IRole {
  _id?: string;
  roleName: string;
  permissions: string[];

  constructor(_id: string,input: any) {
    this._id = _id ? _id.toString() : new Types.ObjectId().toString();
    this.roleName = input?.roleName as string;
    this.permissions = input?.permissions as string[];
    console.log(input);
    
  }

  toJSON(): IRole {
    return omitBy(this, isUndefined) as IRole;
  }
}
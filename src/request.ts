import { Request as ExpressRequest } from "express";

export interface Request extends ExpressRequest {
  _id?: string;
  tokenData?: any;
}
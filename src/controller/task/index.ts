import Controller from "./controller";
import { jwtAuth, checkPermission } from "../../middleware";
import { Router } from "express";

export default class Product extends Controller {
  public router = Router();

  constructor() {
    super();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      "/assign-task",
      jwtAuth,
      checkPermission("give-task"),
      this.assignTask
    );
    this.router.get(
      "/assign-by",
      jwtAuth,
      checkPermission("get-task"),
      this.getTaskAssignBy
    );
    this.router.get(
      "/assign-to",
      jwtAuth,
      checkPermission("get-task"),
      this.getTaskAssignTo
    );
    this.router.patch(
      "/assign-by/:taskId",
      jwtAuth,
      checkPermission("update-task"),
      this.updateTaskAssignBy
    );
    this.router.patch(
      "/assign-to/:taskId",
      jwtAuth,
      checkPermission("update-task"),
      this.updateTaskAssignTo
    );
    this.router.delete(
      "/:taskId",
      jwtAuth,
      checkPermission("delete-task"),
      this.delete
    );
  }
}

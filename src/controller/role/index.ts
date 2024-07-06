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
    this.router.get("/", jwtAuth, checkPermission("get-role"), this.get);
    this.router.post("/", jwtAuth, checkPermission("add-role"), this.create);
    this.router.patch(
      "/:roleId",
      jwtAuth,
      checkPermission("update-role"),
      this.update
    );
    this.router.patch(
      "/remove-permission/:roleId",
      jwtAuth,
      checkPermission("remove-permission"),
      this.removePermission
    );
    this.router.delete(
      "/:roleId",
      jwtAuth,
      checkPermission("delete-role"),
      this.delete
    );
  }
}

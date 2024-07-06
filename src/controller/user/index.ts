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
    this.router.post("/logIn", this.logIn);
    this.router.get("/", jwtAuth, checkPermission("read-user"), this.get);
    this.router.post("/", jwtAuth, checkPermission("create-user"), this.create);
    this.router.patch(
      "/:userId",
      jwtAuth,
      checkPermission("update-user"),
      this.update
    );
    this.router.delete(
      "/:userId",
      jwtAuth,
      checkPermission("delete-user"),
      this.delete
    );
  }
}

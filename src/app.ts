import express from "express";
import Role from "./controller/role";
import User from "./controller/user";
import Task from "./controller/task";

export default class App {
  public static instance: express.Application;
  private static port: number | string;
  public static start(port: number | string) {
    this.instance = express();
    this.port = port;

    this.initializeControllers();
  }
  private static initializeControllers() {
    this.instance.use(express.json());
    this.instance.use("/role", new Role().router);
    this.instance.use("/user", new User().router);
    this.instance.use("/task", new Task().router);
  }
}
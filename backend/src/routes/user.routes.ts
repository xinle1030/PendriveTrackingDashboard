import { Router } from "express";
import UserController from "../controllers/user.controller";
import { verifySignUp } from "../middlewares";

class UserRoutes {
  router = Router();
  controller = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new User
    this.router.post(
      "/signup",
      [verifySignUp.checkDuplicateEmail],
      this.controller.create
    );

    // Signin an existing User
    this.router.post("/sigin", this.controller.signin);

    // Retrieve all Useres
    this.router.get("/", this.controller.findAll);

    // Retrieve a single User with id
    this.router.get("/:id", this.controller.findOne);

    // Update a User with id
    this.router.put("/:id", this.controller.update);

    // Delete a User with id
    this.router.delete("/:id", this.controller.delete);

    // Delete all Useres
    this.router.delete("/", this.controller.deleteAll);
  }
}

export default new UserRoutes().router;

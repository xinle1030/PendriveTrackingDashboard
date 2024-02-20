import { Router } from "express";
import RequestStatusController from "../controllers/requestStatus.controller";

class RequestStatusRoutes {
  router = Router();
  controller = new RequestStatusController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new RequestStatus
    this.router.post("/", this.controller.create);

    // Retrieve all RequestStatuses
    this.router.get("/", this.controller.findAll);

    // Retrieve a single RequestStatus with id
    this.router.get("/:id", this.controller.findOne);

    // Update a RequestStatus with id
    this.router.put("/:id", this.controller.update);

    // Delete a RequestStatus with id
    this.router.delete("/:id", this.controller.delete);

    // Delete all RequestStatuses
    this.router.delete("/", this.controller.deleteAll);
  }
}

export default new RequestStatusRoutes().router;
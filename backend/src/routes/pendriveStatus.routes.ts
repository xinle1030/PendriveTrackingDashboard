import { Router } from "express";
import PendriveStatusController from "../controllers/pendriveStatus.controller";

class PendriveStatusRoutes {
  router = Router();
  controller = new PendriveStatusController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new PendriveStatus
    this.router.post("/", this.controller.create);

    // Retrieve all PendriveStatuses
    this.router.get("/", this.controller.findAll);

    // Retrieve a single PendriveStatus with id
    this.router.get("/:id", this.controller.findOne);

    // Update a PendriveStatus with id
    this.router.put("/:id", this.controller.update);

    // Delete a PendriveStatus with id
    this.router.delete("/:id", this.controller.delete);

    // Delete all PendriveStatuses
    this.router.delete("/", this.controller.deleteAll);
  }
}

export default new PendriveStatusRoutes().router;
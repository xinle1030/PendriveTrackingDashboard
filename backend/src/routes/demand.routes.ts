import { Router } from "express";
import DemandController from "../controllers/demand.controller";

class DemandRoutes {
  router = Router();
  controller = new DemandController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Demand
    this.router.post("/", this.controller.create);

    // Retrieve all Demandes
    this.router.get("/", this.controller.findAll);

    // Retrieve a single Demand with id
    this.router.get("/:id", this.controller.findOne);

    // Update a Demand with id
    this.router.put("/:id", this.controller.update);

    // Delete a Demand with id
    this.router.delete("/:id", this.controller.delete);

    // Delete all Demandes
    this.router.delete("/", this.controller.deleteAll);
  }
}

export default new DemandRoutes().router;
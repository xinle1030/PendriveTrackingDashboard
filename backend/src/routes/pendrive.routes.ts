import { Router } from "express";
import PendriveController from "../controllers/pendrive.controller";
import { validateData } from "../middlewares";

class PendriveRoutes {
  router = Router();
  controller = new PendriveController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Pendrive
    this.router.post(
      "/",
      [validateData.checkValidPenDriveStatus],
      this.controller.create
    );

    // Retrieve all Pendrivees
    this.router.get("/", this.controller.findAll);

    // Retrieve a single Pendrive with id
    this.router.get("/:id", this.controller.findOne);

    // Update a Pendrive with id
    this.router.put(
      "/:id",
      [validateData.checkValidPenDriveStatus],
      this.controller.update
    );

    // Delete a Pendrive with id
    this.router.delete("/:id", this.controller.delete);

    // Delete all Pendrivees
    this.router.delete("/", this.controller.deleteAll);
  }
}

export default new PendriveRoutes().router;

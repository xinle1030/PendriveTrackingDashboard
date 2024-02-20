import { Router } from "express";
import LoanTypeController from "../controllers/loanType.controller";

class LoanTypeRoutes {
  router = Router();
  controller = new LoanTypeController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new LoanType
    this.router.post("/", this.controller.create);

    // Retrieve all LoanTypees
    this.router.get("/", this.controller.findAll);

    // Retrieve a single LoanType with id
    this.router.get("/:id", this.controller.findOne);

    // Update a LoanType with id
    this.router.put("/:id", this.controller.update);

    // Delete a LoanType with id
    this.router.delete("/:id", this.controller.delete);

    // Delete all LoanTypees
    this.router.delete("/", this.controller.deleteAll);
  }
}

export default new LoanTypeRoutes().router;
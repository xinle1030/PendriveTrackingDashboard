import { Router } from "express";
import LoanRequestController from "../controllers/loanRequest.controller";
import { validateData } from "../middlewares";

class LoanRequestRoutes {
  router = Router();
  controller = new LoanRequestController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new LoanRequest
    this.router.post(
      "/",
      [
        validateData.checkValidLoanType,
        validateData.checkValidRequestStatus,
        validateData.checkValidDemand,
        validateData.checkValidPendrive,
        validateData.checkValidCreatedBy,
        validateData.checkValidApprovedBy,
        validateData.checkValidReturnApprovedBy,
      ],
      this.controller.create
    );

    // Retrieve all LoanRequestes
    this.router.get("/", this.controller.findAll);

    // Retrieve a single LoanRequest with id
    this.router.get("/:id", this.controller.findOne);

    // Update a LoanRequest with id
    this.router.put(
      "/:id",
      [
        validateData.checkValidLoanType,
        validateData.checkValidRequestStatus,
        validateData.checkValidDemand,
        validateData.checkValidPendrive,
        validateData.checkValidCreatedBy,
        validateData.checkValidApprovedBy,
        validateData.checkValidReturnApprovedBy,
      ],
      this.controller.update
    );

    // Delete a LoanRequest with id
    this.router.delete("/:id", this.controller.delete);

    // Delete all LoanRequestes
    this.router.delete("/", this.controller.deleteAll);
  }
}

export default new LoanRequestRoutes().router;

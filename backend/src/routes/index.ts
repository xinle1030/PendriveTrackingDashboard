import { Application } from "express";
import requestStatusRoutes from "./requestStatus.routes";
import loanTypeRoutes from "./loanType.routes";
import pendriveStatusRoutes from "./pendriveStatus.routes";
import demandRoutes from "./demand.routes";
import pendriveRoutes from "./pendrive.routes";
import userRoutes from "./user.routes";
import loanRequestRoutes from "./loanRequest.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/requestStatuses", requestStatusRoutes);
    app.use("/api/loanTypes", loanTypeRoutes);
    app.use("/api/pendriveStatuses", pendriveStatusRoutes);
    app.use("/api/demands", demandRoutes);
    app.use("/api/pendrives", pendriveRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/loanRequests", loanRequestRoutes);
  }
}
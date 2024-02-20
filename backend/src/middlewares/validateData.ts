import { Request, Response, NextFunction } from "express";
import Demand from "../models/demand.model";
import LoanType from "../models/loanType.model";
import Pendrive from "../models/pendrive.model";
import PendriveStatus from "../models/pendriveStatus.model";
import RequestStatus from "../models/requestStatus.model";
import User from "../models/user.model";

const checkValidLoanType = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.loanTypeId) {
    next();
  } else {
    LoanType.findOne({
      where: {
        id: req.body.loanTypeId,
      },
    }).then((loanType) => {
      if (!loanType) {
        res.status(400).send({
          message: "Failed! Invalid loanTypeId!",
        });
        return;
      }

      next();
    });
  }
};

const checkValidRequestStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.requestStatusId) {
    next();
  } else {
    RequestStatus.findOne({
      where: {
        id: req.body.requestStatusId,
      },
    }).then((requestStatus) => {
      if (!requestStatus) {
        res.status(400).send({
          message: "Failed! Invalid requestStatusId!",
        });
        return;
      }

      next();
    });
  }
};

const checkValidDemand = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.demandId) {
    next();
  } else {
    Demand.findOne({
      where: {
        id: req.body.demandId,
      },
    }).then((demand) => {
      if (!demand) {
        res.status(400).send({
          message: "Failed! Invalid demandId!",
        });
        return;
      }

      next();
    });
  }
};

const checkValidPendrive = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.pendriveId) {
    next();
  } else {
    Pendrive.findOne({
      where: {
        id: req.body.pendriveId,
      },
    }).then((pendrive) => {
      if (!pendrive) {
        res.status(400).send({
          message: "Failed! Invalid pendriveId!",
        });
        return;
      }

      next();
    });
  }
};

const checkValidCreatedBy = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.createdById) {
    next();
  } else {
    User.findOne({
      where: {
        id: req.body.createdById,
      },
    }).then((user) => {
      if (!user) {
        res.status(400).send({
          message: "Failed! Invalid createdById!",
        });
        return;
      }

      next();
    });
  }
};

const checkValidApprovedBy = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.approvedById) {
    next();
  } else {
    User.findOne({
      where: {
        id: req.body.approvedById,
      },
    }).then((user) => {
      if (!user) {
        res.status(400).send({
          message: "Failed! Invalid approvedById!",
        });
        return;
      }

      next();
    });
  }
};

const checkValidReturnApprovedBy = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.returnApprovedById) {
    next();
  } else {
    User.findOne({
      where: {
        id: req.body.returnApprovedById,
      },
    }).then((user) => {
      if (!user) {
        res.status(400).send({
          message: "Failed! Invalid returnApprovedById!",
        });
        return;
      }

      next();
    });
  }
};

const checkValidPenDriveStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.pendriveStatusId) {
    next();
  } else {
    PendriveStatus.findOne({
      where: {
        id: req.body.pendriveStatusId,
      },
    }).then((pendriveStatus) => {
      if (!pendriveStatus) {
        res.status(400).send({
          message: "Failed! Invalid pendriveStatusId!",
        });
        return;
      }

      next();
    });
  }
};

const validateData = {
  checkValidLoanType: checkValidLoanType,
  checkValidRequestStatus: checkValidRequestStatus,
  checkValidDemand: checkValidDemand,
  checkValidPendrive: checkValidPendrive,
  checkValidCreatedBy: checkValidCreatedBy,
  checkValidApprovedBy: checkValidApprovedBy,
  checkValidReturnApprovedBy: checkValidReturnApprovedBy,
  checkValidPenDriveStatus: checkValidPenDriveStatus,
};

export default validateData;

import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

const checkDuplicateEmail = (req: Request, res: Response, next: NextFunction) : void => {
  // Email
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }

    next();
  });
};

const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
};

export default verifySignUp;
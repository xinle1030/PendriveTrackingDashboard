import { Sequelize } from "sequelize-typescript";
import { config, dialect } from "../../db.config";
import Demand from "../models/demand.model";
import LoanRequest from "../models/loanRequest.model";
import LoanRequestPendrive from "../models/loanRequestPendrive.model";
import LoanType from "../models/loanType.model";
import Pendrive from "../models/pendrive.model";
import PendriveStatus from "../models/pendriveStatus.model";
import RequestStatus from "../models/requestStatus.model";
import User from "../models/user.model";

class Database {
  public sequelize: Sequelize | undefined;

  constructor() {
    this.connectToDatabase();
  }

  private async connectToDatabase() {
    this.sequelize = new Sequelize({
      database: config.DB,
      username: config.USER,
      password: config.PASSWORD,
      host: config.HOST,
      dialect: dialect,
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
      },
      models: [
        RequestStatus,
        LoanType,
        PendriveStatus,
        Demand,
        Pendrive,
        User,
        LoanRequest,
        LoanRequestPendrive,
      ],
    });

    await this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the Database:", err);
      });
  }
}

export default Database;

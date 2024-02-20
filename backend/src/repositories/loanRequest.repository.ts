import { Op } from "sequelize";
import Demand from "../models/demand.model";
import LoanRequest from "../models/loanRequest.model";
import LoanType from "../models/loanType.model";
import Pendrive from "../models/pendrive.model";
import RequestStatus from "../models/requestStatus.model";
import User from "../models/user.model";

interface ILoanRequestRepository {
  save(loanRequest: LoanRequestCreation): Promise<LoanRequest>;
  retrieveAll(searchParams: {}): Promise<LoanRequest[]>;
  retrieveById(requestId: string): Promise<LoanRequest[] | null>;
  update(loanRequest: LoanRequestCreation): Promise<number>;
  delete(requestId: string): Promise<number>;
  deleteAll(): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

export interface LoanRequestCreation extends LoanRequest {
  pendriveIds: Number[];
}

class LoanRequestRepository implements ILoanRequestRepository {
  async save(loanRequest: LoanRequestCreation): Promise<LoanRequest> {
    try {
      const { name, startDate, endDate, demandId, createdById, pendriveIds } =
        loanRequest;

      const newLoanRequest = await LoanRequest.create({
        name,
        startDate,
        endDate,
        demandId,
        createdById,
      });

      // 2. Associate Pendrives with LoanRequest in the junction table
      if (pendriveIds && pendriveIds.length > 0) {
        const pendrives = await Pendrive.findAll({
          where: {
            id: pendriveIds,
          },
        });

        await newLoanRequest.$add("pendrives", pendrives);
      }

      // Return the created LoanRequest
      return newLoanRequest;
    } catch (err) {
      throw new Error("Failed to create LoanRequest!");
    }
  }

  async retrieveAll(searchParams: {}): Promise<LoanRequest[]> {
    try {
      let condition: SearchCondition = {};

      return await LoanRequest.findAll({
        where: condition,
        include: [
          LoanType,
          RequestStatus,
          Demand,
          Pendrive,
          { model: User, as: "createdBy" },
          { model: User, as: "approvedBy" },
          { model: User, as: "returnApprovedBy" },
        ],
        order: [["createdAt", "ASC"]],
      });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to retrieve Requests!");
    }
  }

  async retrieveById(requestId: string): Promise<LoanRequest[] | null> {
    try {
      const loanRequests = await LoanRequest.findAll({
        where: { id: requestId },
        include: [
          LoanType,
          RequestStatus,
          Demand,
          Pendrive,
          { model: User, as: "createdBy" },
          { model: User, as: "approvedBy" },
          { model: User, as: "returnApprovedBy" },
        ],
      });

      return loanRequests;
    } catch (error) {
      throw new Error("Failed to retrieve Requests!");
    }
  }

  async update(loanRequest: LoanRequestCreation): Promise<number> {
    const { id, pendriveIds, ...remainingReq } = loanRequest;
    remainingReq.returnDate = remainingReq.returnDate
      ? remainingReq.returnDate
      : null;

    try {
      // Retrieve LoanRequest by ID
      const existingLoanRequests = await LoanRequest.findAll({
        where: { id: id },
        include: [
          // Include necessary associations
        ],
      });

      for (let existingReq of existingLoanRequests) {
        // Update existing LoanRequest with new data
        await existingReq.update(remainingReq);

        // Update associated Pendrives
        if (pendriveIds && pendriveIds.length > 0) {
          const pendrives = await Pendrive.findAll({
            where: {
              id: pendriveIds,
            },
          });

          await existingReq.$set("pendrives", pendrives);
        }
      }

      // Return the number of affected rows
      return existingLoanRequests.length;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update LoanRequest!");
    }
  }

  async delete(requestId: string): Promise<number> {
    try {
      const affectedRows = await LoanRequest.destroy({
        where: { id: requestId },
      });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete LoanRequest!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return LoanRequest.destroy({
        where: {},
        truncate: false,
      });
    } catch (error) {
      throw new Error("Failed to delete Requests!");
    }
  }
}

export default new LoanRequestRepository();

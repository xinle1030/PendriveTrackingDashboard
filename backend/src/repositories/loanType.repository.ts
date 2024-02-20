import { Op } from "sequelize";
import LoanType from "../models/loanType.model";

interface ILoanTypeRepository {
  save(loanType: LoanType): Promise<LoanType>;
  retrieveAll(searchParams: {}): Promise<LoanType[]>;
  retrieveById(loanTypeId: number): Promise<LoanType | null>;
  update(loanType: LoanType): Promise<number>;
  delete(loanTypeId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class LoanTypeRepository implements ILoanTypeRepository {
  async save(loanType: LoanType): Promise<LoanType> {
    try {
      return await LoanType.create({
        description: loanType.description,
      });
    } catch (err) {
      throw new Error("Failed to create LoanType!");
    }
  }

  async retrieveAll(searchParams: {}): Promise<LoanType[]> {
    try {
      let condition: SearchCondition = {};

      return await LoanType.findAll({
        where: condition,
        order: [["id", "ASC"]],
      });
    } catch (error) {
      throw new Error("Failed to retrieve LoanTypes!");
    }
  }

  async retrieveById(loanTypeId: number): Promise<LoanType | null> {
    try {
      return await LoanType.findByPk(loanTypeId);
    } catch (error) {
      throw new Error("Failed to retrieve LoanTypes!");
    }
  }

  async update(loanType: LoanType): Promise<number> {
    const { id, description } = loanType;

    try {
      const affectedRows = await LoanType.update(
        { description },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update LoanType!");
    }
  }

  async delete(loanTypeId: number): Promise<number> {
    try {
      const affectedRows = await LoanType.destroy({
        where: { id: loanTypeId },
      });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete LoanType!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return LoanType.destroy({
        where: {},
        truncate: false,
      });
    } catch (error) {
      throw new Error("Failed to delete LoanTypes!");
    }
  }
}

export default new LoanTypeRepository();

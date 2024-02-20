import { Op } from "sequelize";
import RequestStatus from "../models/requestStatus.model";

interface IRequestStatusRepository {
  save(requestStatus: RequestStatus): Promise<RequestStatus>;
  retrieveAll(searchParams: {}): Promise<RequestStatus[]>;
  retrieveById(requestStatusId: number): Promise<RequestStatus | null>;
  update(requestStatus: RequestStatus): Promise<number>;
  delete(requestStatusId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class RequestStatusRepository implements IRequestStatusRepository {
  async save(requestStatus: RequestStatus): Promise<RequestStatus> {
    try {
      return await RequestStatus.create({
        description: requestStatus.description,
      });
    } catch (err) {
      throw new Error("Failed to create RequestStatus!");
    }
  }

  async retrieveAll(searchParams: {}): Promise<RequestStatus[]> {
    try {
      let condition: SearchCondition = {};

      return await RequestStatus.findAll({
        where: condition,
        order: [["id", "ASC"]],
      });
    } catch (error) {
      throw new Error("Failed to retrieve RequestStatuss!");
    }
  }

  async retrieveById(requestStatusId: number): Promise<RequestStatus | null> {
    try {
      return await RequestStatus.findByPk(requestStatusId);
    } catch (error) {
      throw new Error("Failed to retrieve RequestStatuss!");
    }
  }

  async update(requestStatus: RequestStatus): Promise<number> {
    const { id, description } = requestStatus;

    try {
      const affectedRows = await RequestStatus.update(
        { description },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update RequestStatus!");
    }
  }

  async delete(requestStatusId: number): Promise<number> {
    try {
      const affectedRows = await RequestStatus.destroy({
        where: { id: requestStatusId },
      });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete RequestStatus!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return RequestStatus.destroy({
        where: {},
        truncate: false,
      });
    } catch (error) {
      throw new Error("Failed to delete RequestStatuss!");
    }
  }
}

export default new RequestStatusRepository();

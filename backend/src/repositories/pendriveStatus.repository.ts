import { Op } from "sequelize";
import PendriveStatus from "../models/pendriveStatus.model";

interface IPendriveStatusRepository {
  save(pendriveStatus: PendriveStatus): Promise<PendriveStatus>;
  retrieveAll(searchParams: {}): Promise<PendriveStatus[]>;
  retrieveById(pendriveStatusId: number): Promise<PendriveStatus | null>;
  update(pendriveStatus: PendriveStatus): Promise<number>;
  delete(pendriveStatusId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class PendriveStatusRepository implements IPendriveStatusRepository {
  async save(pendriveStatus: PendriveStatus): Promise<PendriveStatus> {
    try {
      return await PendriveStatus.create({
        description: pendriveStatus.description,
      });
    } catch (err) {
      throw new Error("Failed to create PendriveStatus!");
    }
  }

  async retrieveAll(searchParams: {}): Promise<PendriveStatus[]> {
    try {
      let condition: SearchCondition = {};

      return await PendriveStatus.findAll({
        where: condition,
        order: [["id", "ASC"]],
      });
    } catch (error) {
      throw new Error("Failed to retrieve PendriveStatuss!");
    }
  }

  async retrieveById(pendriveStatusId: number): Promise<PendriveStatus | null> {
    try {
      return await PendriveStatus.findByPk(pendriveStatusId);
    } catch (error) {
      throw new Error("Failed to retrieve PendriveStatuss!");
    }
  }

  async update(pendriveStatus: PendriveStatus): Promise<number> {
    const { id, description } = pendriveStatus;

    try {
      const affectedRows = await PendriveStatus.update(
        { description },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update PendriveStatus!");
    }
  }

  async delete(pendriveStatusId: number): Promise<number> {
    try {
      const affectedRows = await PendriveStatus.destroy({
        where: { id: pendriveStatusId },
      });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete PendriveStatus!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return PendriveStatus.destroy({
        where: {},
        truncate: false,
      });
    } catch (error) {
      throw new Error("Failed to delete PendriveStatuss!");
    }
  }
}

export default new PendriveStatusRepository();

import { Op } from "sequelize";
import Demand from "../models/demand.model";

interface IDemandRepository {
  save(demand: Demand): Promise<Demand>;
  retrieveAll(searchParams: {}): Promise<Demand[]>;
  retrieveById(demandId: string): Promise<Demand | null>;
  update(demand: Demand): Promise<number>;
  delete(demandId: string): Promise<number>;
  deleteAll(): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class DemandRepository implements IDemandRepository {
  async save(demand: Demand): Promise<Demand> {
    try {
      return await Demand.create({
        name: demand.name,
      });
    } catch (err) {
      throw new Error("Failed to create Demand!");
    }
  }

  async retrieveAll(searchParams: {}): Promise<Demand[]> {
    try {
      let condition: SearchCondition = {};

      return await Demand.findAll({
        where: condition,
        order: [["createdAt", "ASC"]],
      });
    } catch (error) {
      throw new Error("Failed to retrieve Demands!");
    }
  }

  async retrieveById(demandId: string): Promise<Demand | null> {
    try {
      return await Demand.findByPk(demandId);
    } catch (error) {
      throw new Error("Failed to retrieve Demands!");
    }
  }

  async update(demand: Demand): Promise<number> {
    const { id, name } = demand;

    try {
      const affectedRows = await Demand.update({ name }, { where: { id: id } });

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Demand!");
    }
  }

  async delete(demandId: string): Promise<number> {
    try {
      const affectedRows = await Demand.destroy({ where: { id: demandId } });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Demand!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return Demand.destroy({
        where: {},
        truncate: false,
      });
    } catch (error) {
      throw new Error("Failed to delete Demands!");
    }
  }
}

export default new DemandRepository();

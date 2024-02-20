import { Op } from "sequelize";
import Pendrive from "../models/pendrive.model";
import PendriveStatus from "../models/pendriveStatus.model";

interface IPendriveRepository {
  save(pendrive: Pendrive): Promise<Pendrive>;
  retrieveAll(searchParams: {}): Promise<Pendrive[]>;
  retrieveById(pendriveId: number): Promise<Pendrive | null>;
  update(pendrive: Pendrive): Promise<number>;
  delete(pendriveId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class PendriveRepository implements IPendriveRepository {
  async save(pendrive: Pendrive): Promise<Pendrive> {
    try {
      return await Pendrive.create({
        description: pendrive.description,
        location: pendrive.location,
        pendriveStatusId: pendrive.pendriveStatusId,
      });
    } catch (err) {
      throw new Error("Failed to create Pendrive!");
    }
  }

  async retrieveAll(searchParams: {}): Promise<Pendrive[]> {
    try {
      let condition: SearchCondition = {};

      return await Pendrive.findAll({
        where: condition,
        include: [PendriveStatus],
        order: [["createdAt", "ASC"]],
      });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to retrieve Pendrives!");
    }
  }

  async retrieveById(pendriveId: number): Promise<Pendrive | null> {
    try {
      return await Pendrive.findByPk(pendriveId, {
        include: [PendriveStatus],
      });
    } catch (error) {
      throw new Error("Failed to retrieve Pendrives!");
    }
  }

  async update(pendrive: Pendrive): Promise<number> {
    const { id, description, location, pendriveStatusId } = pendrive;

    try {
      const affectedRows = await Pendrive.update(
        { description, location, pendriveStatusId },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Pendrive!");
    }
  }

  async delete(pendriveId: number): Promise<number> {
    try {
      const affectedRows = await Pendrive.destroy({
        where: { id: pendriveId },
      });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Pendrive!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return Pendrive.destroy({
        where: {},
        truncate: false,
      });
    } catch (error) {
      throw new Error("Failed to delete Pendrives!");
    }
  }
}

export default new PendriveRepository();

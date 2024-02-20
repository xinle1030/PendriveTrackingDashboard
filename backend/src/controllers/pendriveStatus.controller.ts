import { Request, Response } from "express";
import PendriveStatus from "../models/pendriveStatus.model";
import pendriveStatusRepository from "../repositories/pendriveStatus.repository";

export default class PendriveStatusController {
  async create(req: Request, res: Response) {
    if (!req.body.description) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    try {
      const pendriveStatus: PendriveStatus = req.body;
      const savedPendriveStatus = await pendriveStatusRepository.save(pendriveStatus);

      res.status(201).send(savedPendriveStatus);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving pendriveStatuses."
      });
    }
  }

  async findAll(req: Request, res: Response) {

    try {
      const pendriveStatuses = await pendriveStatusRepository.retrieveAll({  });

      res.status(200).send(pendriveStatuses);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving pendriveStatuses."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const pendriveStatus = await pendriveStatusRepository.retrieveById(id);

      if (pendriveStatus) res.status(200).send(pendriveStatus);
      else
        res.status(404).send({
          message: `Cannot find PendriveStatus with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving PendriveStatus with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let pendriveStatus: PendriveStatus = req.body;
    pendriveStatus.id = parseInt(req.params.id);

    try {
      const num = await pendriveStatusRepository.update(pendriveStatus);

      if (num == 1) {
        res.send({
          message: "PendriveStatus was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update PendriveStatus with id=${pendriveStatus.id}. Maybe PendriveStatus was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating PendriveStatus with id=${pendriveStatus.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await pendriveStatusRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "PendriveStatus was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete PendriveStatus with id=${id}. Maybe PendriveStatus was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete PendriveStatus with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await pendriveStatusRepository.deleteAll();

      res.send({ message: `${num} PendriveStatuss were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all pendriveStatuses."
      });
    }
  }
}
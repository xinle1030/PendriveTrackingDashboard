import { Request, Response } from "express";
import Pendrive from "../models/pendrive.model";
import pendriveRepository from "../repositories/pendrive.repository";

export default class PendriveController {
  async create(req: Request, res: Response) {
    if (!req.body.description) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    try {
      const pendrive: Pendrive = req.body;
      const savedPendrive = await pendriveRepository.save(pendrive);

      res.status(201).send(savedPendrive);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving pendrivees."
      });
    }
  }

  async findAll(req: Request, res: Response) {

    try {
      const pendrivees = await pendriveRepository.retrieveAll({  });

      res.status(200).send(pendrivees);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving pendrivees."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const pendrive = await pendriveRepository.retrieveById(id);

      if (pendrive) res.status(200).send(pendrive);
      else
        res.status(404).send({
          message: `Cannot find Pendrive with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Pendrive with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let pendrive: Pendrive = req.body;
    pendrive.id = parseInt(req.params.id);

    try {
      const num = await pendriveRepository.update(pendrive);

      if (num == 1) {
        res.send({
          message: "Pendrive was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Pendrive with id=${pendrive.id}. Maybe Pendrive was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Pendrive with id=${pendrive.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await pendriveRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "Pendrive was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Pendrive with id=${id}. Maybe Pendrive was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Pendrive with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await pendriveRepository.deleteAll();

      res.send({ message: `${num} Pendrives were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all pendrivees."
      });
    }
  }
}
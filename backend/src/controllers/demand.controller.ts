import { Request, Response } from "express";
import Demand from "../models/demand.model";
import demandRepository from "../repositories/demand.repository";

export default class DemandController {
  async create(req: Request, res: Response) {
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    try {
      const demand: Demand = req.body;
      const savedDemand = await demandRepository.save(demand);

      res.status(201).send(savedDemand);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving demands."
      });
    }
  }

  async findAll(req: Request, res: Response) {

    try {
      const demands = await demandRepository.retrieveAll({  });

      res.status(200).send(demands);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving demands."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      const demand = await demandRepository.retrieveById(id);

      if (demand) res.status(200).send(demand);
      else
        res.status(404).send({
          message: `Cannot find Demand with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Demand with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let demand: Demand = req.body;
    demand.id = req.params.id;

    try {
      const num = await demandRepository.update(demand);

      if (num == 1) {
        res.send({
          message: "Demand was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Demand with id=${demand.id}. Maybe Demand was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Demand with id=${demand.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      const num = await demandRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "Demand was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Demand with id=${id}. Maybe Demand was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Demand with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await demandRepository.deleteAll();

      res.send({ message: `${num} Demands were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all demands."
      });
    }
  }
}
import { Request, Response } from "express";
import LoanType from "../models/loanType.model";
import loanTypeRepository from "../repositories/loanType.repository";

export default class LoanTypeController {
  async create(req: Request, res: Response) {
    if (!req.body.description) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    try {
      const loanType: LoanType = req.body;
      const savedLoanType = await loanTypeRepository.save(loanType);

      res.status(201).send(savedLoanType);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving loanTypes."
      });
    }
  }

  async findAll(req: Request, res: Response) {

    try {
      const loanTypes = await loanTypeRepository.retrieveAll({  });

      res.status(200).send(loanTypes);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving loanTypes."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const loanType = await loanTypeRepository.retrieveById(id);

      if (loanType) res.status(200).send(loanType);
      else
        res.status(404).send({
          message: `Cannot find LoanType with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving LoanType with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let loanType: LoanType = req.body;
    loanType.id = parseInt(req.params.id);

    try {
      const num = await loanTypeRepository.update(loanType);

      if (num == 1) {
        res.send({
          message: "LoanType was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update LoanType with id=${loanType.id}. Maybe LoanType was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating LoanType with id=${loanType.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await loanTypeRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "LoanType was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete LoanType with id=${id}. Maybe LoanType was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete LoanType with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await loanTypeRepository.deleteAll();

      res.send({ message: `${num} LoanTypes were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all loanTypes."
      });
    }
  }
}
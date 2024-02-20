import { Request, Response } from "express";
import LoanRequest from "../models/loanRequest.model";
import loanRequestRepository from "../repositories/loanRequest.repository";
import { LoanRequestCreation } from "../repositories/loanRequest.repository";

export default class LoanRequestController {
  async create(req: Request, res: Response) {
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    try {
      const loanRequest: LoanRequestCreation = req.body;
      const savedLoanRequest = await loanRequestRepository.save(loanRequest);

      res.status(201).send(savedLoanRequest);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving loanRequests.",
      });
    }
  }
  async findAll(req: Request, res: Response) {
    try {
      const loanRequests = await loanRequestRepository.retrieveAll({});

      res.status(200).send(loanRequests);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving loanRequests.",
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      const loanRequest = await loanRequestRepository.retrieveById(id);

      if (loanRequest) res.status(200).send(loanRequest);
      else
        res.status(404).send({
          message: `Cannot find LoanRequest with id=${id}.`,
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving LoanRequest with id=${id}.`,
      });
    }
  }

  async update(req: Request, res: Response) {
    let loanRequest: LoanRequestCreation = req.body;
    loanRequest.id = req.params.id;

    try {
      const num = await loanRequestRepository.update(loanRequest);

      if (num == 1) {
        res.send({
          message: "LoanRequest was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update LoanRequest with id=${loanRequest.id}. Maybe LoanRequest was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating LoanRequest with id=${loanRequest.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      const num = await loanRequestRepository.delete(id);

      if (num) {
        res.send({
          message: "LoanRequest was deleted successfully!",
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete LoanRequest with id==${id}.`,
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await loanRequestRepository.deleteAll();

      res.send({ message: `${num} LoanRequests were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all loanRequests.",
      });
    }
  }
}

import { Request, Response } from "express";
import RequestStatus from "../models/requestStatus.model";
import requestStatusRepository from "../repositories/requestStatus.repository";

export default class RequestStatusController {
  async create(req: Request, res: Response) {
    if (!req.body.description) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    try {
      const requestStatus: RequestStatus = req.body;
      const savedRequestStatus = await requestStatusRepository.save(requestStatus);

      res.status(201).send(savedRequestStatus);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving requestStatuses."
      });
    }
  }

  async findAll(req: Request, res: Response) {

    try {
      const requestStatuses = await requestStatusRepository.retrieveAll({  });

      res.status(200).send(requestStatuses);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving requestStatuses."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const requestStatus = await requestStatusRepository.retrieveById(id);

      if (requestStatus) res.status(200).send(requestStatus);
      else
        res.status(404).send({
          message: `Cannot find RequestStatus with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving RequestStatus with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let requestStatus: RequestStatus = req.body;
    requestStatus.id = parseInt(req.params.id);

    try {
      const num = await requestStatusRepository.update(requestStatus);

      if (num == 1) {
        res.send({
          message: "RequestStatus was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update RequestStatus with id=${requestStatus.id}. Maybe RequestStatus was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating RequestStatus with id=${requestStatus.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await requestStatusRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "RequestStatus was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete RequestStatus with id=${id}. Maybe RequestStatus was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete RequestStatus with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await requestStatusRepository.deleteAll();

      res.send({ message: `${num} RequestStatuss were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all requestStatuses."
      });
    }
  }
}
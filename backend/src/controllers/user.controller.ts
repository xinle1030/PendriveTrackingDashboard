import { Request, Response } from "express";
import User from "../models/user.model";
import userRepository from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/auth.config";

export default class UserController {
  async create(req: Request, res: Response) {
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    try {
      const user: User = req.body;
      const savedUser = await userRepository.save(user);

      res.status(201).send(savedUser);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  }

  async signin(req: Request, res: Response) {
    if (!req.body.email || !req.body.password) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password || ""
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        });

        const { password, ...retUser } = user.dataValues;

        res.status(201).send({ ...retUser, token: token });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }

  async findAll(req: Request, res: Response) {
    const email = typeof req.query.email === "string" ? req.query.email : "";

    try {
      const users = await userRepository.retrieveAll({ email });

      res.status(200).send(users);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      const user = await userRepository.retrieveById(id);

      if (user) res.status(200).send(user);
      else
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving User with id=${id}.`,
      });
    }
  }

  async update(req: Request, res: Response) {
    let user: User = req.body;
    user.id = req.params.id;

    try {
      const num = await userRepository.update(user);

      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${user.id}. Maybe User was not found or req.body is empty!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating User with id=${user.id}.`,
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      const num = await userRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete User with id==${id}.`,
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await userRepository.deleteAll();

      res.send({ message: `${num} Users were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all users.",
      });
    }
  }
}

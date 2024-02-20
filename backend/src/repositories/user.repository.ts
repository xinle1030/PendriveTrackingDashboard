import { Op } from "sequelize";
import User from "../models/user.model";
import bcrypt from "bcrypt";

interface IUserRepository {
  save(user: User): Promise<User>;
  retrieveAll(searchParams: { email: string }): Promise<User[]>;
  retrieveById(userId: string): Promise<User | null>;
  update(user: User): Promise<number>;
  delete(userId: string): Promise<number>;
  deleteAll(): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class UserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    try {
      return await User.create({
        name: user.name,
        email: user.email,
        password: bcrypt.hashSync(user.password || "", 8),
      });
    } catch (err) {
      throw new Error("Failed to create User!");
    }
  }

  async retrieveAll(searchParams: { email?: string }): Promise<User[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email) condition.email = searchParams.email;

      return await User.findAll({ where: condition, order: [["id", "ASC"]] });
    } catch (error) {
      throw new Error("Failed to retrieve Users!");
    }
  }

  async retrieveById(userId: string): Promise<User | null> {
    try {
      return await User.findByPk(userId);
    } catch (error) {
      throw new Error("Failed to retrieve Users!");
    }
  }

  async update(user: User): Promise<number> {
    const { id, name, email, password } = user;
    const hashedPassword = bcrypt.hashSync(password || "", 8);

    try {
      const affectedRows = await User.update(
        { name, email, password: hashedPassword },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update User!");
    }
  }

  async delete(userId: string): Promise<number> {
    try {
      const affectedRows = await User.destroy({ where: { id: userId } });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete User!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return User.destroy({
        where: {},
        truncate: false,
      });
    } catch (error) {
      throw new Error("Failed to delete Users!");
    }
  }
}

export default new UserRepository();

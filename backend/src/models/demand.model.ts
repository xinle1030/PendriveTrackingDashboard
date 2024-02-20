import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  BeforeCreate,
} from "sequelize-typescript";
import Request from "./loanRequest.model";

@Table({
  tableName: "demands",
})
export default class Demand extends Model {
  @Column({
    type: DataType.STRING(11),
    primaryKey: true,
    field: "id",
  })
  id?: string;

  @Column({
    type: DataType.STRING(255),
    field: "name",
  })
  name?: string;

  @HasMany(() => Request)
  requests?: Request[];

  @BeforeCreate
  static async generateCustomId(instance: Demand) {
    try {
      // Get the last inserted item
      const lastInsertedDemand = await Demand.findOne({
        order: [["createdAt", "DESC"]],
      });

      // Extract the numeric part from the current ID and increment it
      const lastInsertedId = lastInsertedDemand?.id
        ? parseInt(lastInsertedDemand.id.substring(4)) + 1
        : 1;

      // Format the incremented ID to have leading zeros
      const formattedId = lastInsertedId.toString().padStart(7, "0");

      // Set the new custom ID
      instance.id = `DMND${formattedId}`;
    } catch (error) {
      console.error("Error generating custom ID for Demand:", error);
      throw error;
    }
  }
}

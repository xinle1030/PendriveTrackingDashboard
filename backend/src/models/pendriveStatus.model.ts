import { Model, Table, Column, DataType, HasMany } from "sequelize-typescript";
import Pendrive from "./pendrive.model";

@Table({
  tableName: "pendriveStatuses",
})
export default class PendriveStatus extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id"
  })
  id?: number;

  @Column({
    type: DataType.STRING(255),
    field: "description"
  })
  description?: string;

  @HasMany(() => Pendrive)
  pendrives?: Pendrive[];
}
import { Model, Table, Column, DataType, HasMany } from "sequelize-typescript";
import Request from "./loanRequest.model";

@Table({
  tableName: "loanTypes",
})
export default class LoanType extends Model {
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

  @HasMany(() => Request)
  requests?: Request[];
}
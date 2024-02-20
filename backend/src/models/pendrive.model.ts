import { Model, Table, Column, DataType, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript";
import LoanRequest from "./loanRequest.model";
import LoanRequestPendrive from "./loanRequestPendrive.model";
import PendriveStatus from "./pendriveStatus.model";

@Table({
  tableName: "pendrives",
})
export default class Pendrive extends Model {
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

  @Column({
    type: DataType.STRING(255),
    field: "location",
    defaultValue: "rack",
  })
  location?: string;

  @ForeignKey(() => PendriveStatus)
  @Column({
    type: DataType.INTEGER,
    field: "pendriveStatusId",
    defaultValue: 1,
  })
  pendriveStatusId?: number; // This assumes you have a foreign key column in the Pendrive table referencing PendriveStatus

  @BelongsTo(() => PendriveStatus)
  pendriveStatus?: PendriveStatus; // Define the association with PendriveStatus model

  @BelongsToMany(() => LoanRequest, () => LoanRequestPendrive, "pendriveId", "loanRequestId")
  loanRequests?: LoanRequest[];
}
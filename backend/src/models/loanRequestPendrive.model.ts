import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import LoanRequest from "./loanRequest.model";
import Pendrive from "./pendrive.model";

@Table({
  tableName: "loanRequestPendrives",
})
export default class LoanRequestPendrive extends Model {
  @ForeignKey(() => LoanRequest)
  @Column({
    type: DataType.STRING(11),
    primaryKey: true,
    field: "loanRequestId",
  })
  loanRequestId!: string;

  @ForeignKey(() => Pendrive)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    field: "pendriveId",
  })
  pendriveId!: number;

  @BelongsTo(() => LoanRequest)
  loanRequest?: LoanRequest;

  @BelongsTo(() => Pendrive)
  pendrive?: Pendrive;
}

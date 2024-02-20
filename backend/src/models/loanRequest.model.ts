import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  BelongsToMany,
} from "sequelize-typescript";
import Demand from "./demand.model";
import LoanRequestPendrive from "./loanRequestPendrive.model";
import LoanType from "./loanType.model";
import Pendrive from "./pendrive.model";
import RequestStatus from "./requestStatus.model";
import User from "./user.model";

@Table({
  tableName: "loanRequests",
})
export default class LoanRequest extends Model {
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

  @Column({
    type: DataType.DATEONLY,
    field: "startDate",
  })
  startDate?: Date;

  @Column({
    type: DataType.DATEONLY,
    field: "endDate",
  })
  endDate?: Date;

  @Column({
    type: DataType.DATEONLY,
    field: "returnDate",
    allowNull: true,
  })
  returnDate?: Date | null;

  @ForeignKey(() => LoanType)
  @Column({
    type: DataType.INTEGER,
    field: "loanTypeId",
    defaultValue: 1,
  })
  loanTypeId?: number;

  @BelongsTo(() => LoanType)
  loanType?: LoanType;

  @ForeignKey(() => RequestStatus)
  @Column({
    type: DataType.INTEGER,
    field: "requestStatusId",
    defaultValue: 1,
  })
  requestStatusId?: number; // This assumes you have a foreign key column in the LoanRequest table referencing LoanRequestStatus

  @BelongsTo(() => RequestStatus)
  requestStatus?: RequestStatus; // Define the association with LoanRequestStatus model

  @ForeignKey(() => Demand)
  @Column({
    type: DataType.STRING,
    field: "demandId",
  })
  demandId?: string;

  @BelongsTo(() => Demand)
  demand?: Demand;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: "createdById",
  })
  createdById?: string;

  @BelongsTo(() => User, "createdById")
  createdBy?: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: "approvedById",
  })
  approvedById?: string | null;

  @BelongsTo(() => User, "approvedById")
  approvedBy?: User | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: "returnApprovedById",
  })
  returnApprovedById?: string | null;

  @BelongsTo(() => User, "returnApprovedById")
  returnApprovedBy?: User | null;

  @BelongsToMany(
    () => Pendrive,
    () => LoanRequestPendrive,
    "loanRequestId",
    "pendriveId"
  )
  pendrives?: Pendrive[];

  @BeforeCreate
  static async generateCustomId(instance: Demand) {
    try {
      // Get the last inserted item
      const lastInsertedRequest = await LoanRequest.findOne({
        order: [["createdAt", "DESC"]],
      });

      // Extract the numeric part from the current ID and increment it
      const lastInsertedId = lastInsertedRequest?.id
        ? parseInt(lastInsertedRequest.id.substring(4)) + 1
        : 1;

      // Format the incremented ID to have leading zeros
      const formattedId = lastInsertedId.toString().padStart(7, "0");

      // Set the new custom ID
      instance.id = `PRRQ${formattedId}`;
    } catch (error) {
      console.error("Error generating custom ID for Loan Request:", error);
      throw error;
    }
  }
}

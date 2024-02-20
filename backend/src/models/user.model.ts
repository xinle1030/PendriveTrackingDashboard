import { Model, Table, Column, DataType, HasMany } from "sequelize-typescript";
import Request from "./loanRequest.model";

@Table({
  tableName: "users",
})
export default class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
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
    type: DataType.STRING(255),
    field: "email",
  })
  email?: string;

  @Column({
    type: DataType.STRING(255),
    field: "password",
  })
  password?: string;

  @HasMany(() => Request)
  requests?: Request[];
}

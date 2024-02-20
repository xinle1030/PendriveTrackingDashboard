import { Demand, emptyDemand } from "./demand";
import { LoanType } from "./loanType";
import { Pendrive } from "./pendrive";
import { RequestStatus } from "./requestStatus";
import { emptyUser, User } from "./user";

export interface LoanRequestCreation {
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  loanTypeId: number;
  demandId: string;
  pendriveIds: number[];
  createdById: string;
}

export interface LoanRequest extends Omit<LoanRequestCreation, "pendriveIds"> {
  id: string;
  returnDate: string | Date | null;
  requestStatusId: number | null;
  pendrives: Pendrive[];
  approvedById: string;
  returnApprovedById: string;

  loanType: LoanType;
  demand: Demand;
  requestStatus: RequestStatus;
  createdBy: User;
  approvedBy: User;
  returnApprovedBy: User;
  createdAt: string | Date;
}

export interface LoanRequestUpdate extends LoanRequestCreation {
  id: string;
  returnDate: string | Date | null;
  requestStatusId: number | null;
  approvedById: string | null;
  returnApprovedById: string | null;
}

export interface EmptyLoanRequest extends LoanRequestUpdate {
  demand: Demand;
  createdBy: User;
  approvedBy: User;
  returnApprovedBy: User;
}

export const emptyLoanRequest: EmptyLoanRequest = {
  id: "",
  name: "",
  startDate: "",
  endDate: "",
  returnDate: null,
  loanTypeId: 1,
  demandId: "",
  pendriveIds: [],
  createdById: "",
  approvedById: "",
  returnApprovedById: "",
  requestStatusId: 1,
  demand: emptyDemand,
  createdBy: emptyUser,
  approvedBy: emptyUser,
  returnApprovedBy: emptyUser,
};

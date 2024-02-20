import { PendriveStatus } from "./PendriveStatus";

export interface Pendrive {
  id: number;
  description: string;
  location: string;
  pendriveStatusId: number;
  pendriveStatus: PendriveStatus;
  createdAt: string | Date;
}

export interface PendriveUpdate
  extends Omit<Pendrive, "pendriveStatus" | "pendriveStatusId"> {
  id: number;
  description: string;
  location: string;
  pendriveStatusId: number | null;
  createdAt: string | Date;
}

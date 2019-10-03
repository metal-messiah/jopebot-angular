import { User } from "./user";

export interface Entity {
  readonly id?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly createdBy?: User;
}

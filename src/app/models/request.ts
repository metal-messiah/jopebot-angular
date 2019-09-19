import { Entity } from "./entity";
import { UserState } from "./user-state";

export class Request implements Entity {
  id: number;
  createdAt: Date = new Date();
  channel: string;
  message: string;
  userId: number;
  streamerId: number;
  logo?: URL;
  self: boolean;

  attachment?: File;
  link?: URL;

  constructor(obj: Request) {
    Object.assign(this, obj);
  }
}

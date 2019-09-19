import { Entity } from "./entity";

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

  created_by: number;

  constructor(obj: Request) {
    Object.assign(this, obj);
  }
}

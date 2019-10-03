import { Entity } from "./entity";
import { User } from "./user";

export class Request implements Entity {
  id?: number;
  createdAt?: Date;
  createdBy?: User;
  updatedAt?: Date;
  user?: User;
  streamer?: User;
  self?: boolean;

  message?: string;
  song?: string;
  link?: URL;

  played?: Date;

  constructor(obj: Request) {
    Object.assign(this, obj);

    if (obj.createdBy) {
      this.createdBy = new User(obj.createdBy);
    }
    if (obj.streamer) {
      this.streamer = new User(obj.streamer);
    }
    if (obj.user) {
      this.user = new User(obj.user);
    }

    if (obj.createdAt) {
      this.createdAt = new Date(obj.createdAt);
    }
    if (obj.updatedAt) {
      this.updatedAt = new Date(obj.updatedAt);
    }
  }
}

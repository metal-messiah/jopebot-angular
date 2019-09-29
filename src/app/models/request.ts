import { Entity } from "./entity";
import { User } from "./user";

export class Request implements Entity {
  id: number;
  createdAt: Date;
  createdBy: User;
  channel: string;
  message: string;
  user: User;
  streamer: User;
  logo?: URL;
  self: boolean;

  attachment: File;
  link: URL;
  played: Date;

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
  }
}

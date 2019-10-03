import { Entity } from "./entity";
import { User } from "./user";

export class StreamerSong implements Entity {
  id: number;
  user: User;
  data: object[];

  createdAt: Date;
  createdBy: User;
  updatedAt: Date;

  constructor(obj: StreamerSong) {
    Object.assign(this, obj);
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

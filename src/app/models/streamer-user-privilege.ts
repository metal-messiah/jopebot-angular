import { Entity } from "./entity";
import { User } from "./user";

export class StreamerUserPrivilege implements Entity {
  id: number;
  user: User;
  streamer: User;
  is_admin: boolean;
  is_blacklisted: boolean;

  createdAt: Date;
  createdBy: User;
  updatedAt: Date;

  constructor(obj: StreamerUserPrivilege) {
    Object.assign(this, obj);
    if (obj.user) {
      this.user = new User(obj.user);
    }
    if (obj.streamer) {
      this.streamer = new User(obj.streamer);
    }
    if (obj.createdAt) {
      this.createdAt = new Date(obj.createdAt);
    }
    if (obj.updatedAt) {
      this.updatedAt = new Date(obj.updatedAt);
    }
  }
}

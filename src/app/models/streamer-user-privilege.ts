import { Entity } from "./entity";
import { User } from "./user";

export class StreamerUserPrivilege implements Entity {
  id: number;
  user: User;
  streamer: User;
  is_admin: boolean;
  is_blacklisted: boolean;

  createdBy: User;

  constructor(obj: StreamerUserPrivilege) {
    Object.assign(this, obj);
  }
}

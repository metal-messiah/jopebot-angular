import { Entity } from "./entity";

export class StreamerUserPrivilege implements Entity {
  id: number;
  user_id: number;
  streamer_id: number;
  is_admin: boolean;
  is_blacklisted: boolean;

  created_by: number;

  constructor(obj: StreamerUserPrivilege) {
    Object.assign(this, obj);
  }
}

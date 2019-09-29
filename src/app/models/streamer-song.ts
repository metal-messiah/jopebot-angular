import { Entity } from "./entity";
import { User } from "./user";

export class StreamerSong implements Entity {
  id: number;
  user: User;
  data: object[];

  createdBy: User;

  constructor(obj: StreamerSong) {
    Object.assign(this, obj);
  }
}

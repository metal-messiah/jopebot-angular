import { Entity } from "./entity";

export class StreamerSong implements Entity {
  id: number;
  user_id: number;
  url: URL;

  created_by: number;

  constructor(obj: StreamerSong) {
    Object.assign(this, obj);
  }
}

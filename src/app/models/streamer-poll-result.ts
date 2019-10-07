import { Entity } from './entity';
import { User } from './user';

export class StreamerPollResult {
  requestId: number;
  votes: number;

  constructor(obj: StreamerPollResult) {
    Object.assign(this, obj);
  }
}

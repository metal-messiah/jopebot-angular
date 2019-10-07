import { Entity } from './entity';
import { User } from './user';
import { StreamerPoll } from './streamer-poll';

export class StreamerPollRequest implements Entity {
  id?: number;
  request?: Request;
  streamerPoll?: StreamerPoll;
  createdAt?: Date;
  createdBy?: User;
  updatedAt?: Date;

  constructor(obj: StreamerPollRequest) {
    Object.assign(this, obj);

    if (obj.createdBy) {
      this.createdBy = new User(obj.createdBy);
    }
    if (obj.request) {
      this.request = new Request(obj.request);
    }
    if (obj.streamerPoll) {
      this.streamerPoll = new StreamerPoll(obj.streamerPoll);
    }
    if (obj.createdAt) {
      this.createdAt = new Date(obj.createdAt);
    }
    if (obj.updatedAt) {
      this.updatedAt = new Date(obj.updatedAt);
    }
  }
}

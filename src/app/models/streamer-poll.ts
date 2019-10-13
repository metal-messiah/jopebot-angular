import { Entity } from './entity';
import { User } from './user';
import { StreamerPollRequest } from './streamer-poll-request';

export class StreamerPoll implements Entity {
  id?: number;
  createdAt?: Date;
  createdBy?: User;
  updatedAt?: Date;
  user?: User;
  isOpen?: boolean;
  requests?: StreamerPollRequest[];

  constructor(obj: StreamerPoll) {
    Object.assign(this, obj);

    if (obj.createdBy) {
      this.createdBy = new User(obj.createdBy);
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
    if (obj.requests && obj.requests.length) {
      this.requests = obj.requests.map(request => new StreamerPollRequest(request));
    }
  }
}

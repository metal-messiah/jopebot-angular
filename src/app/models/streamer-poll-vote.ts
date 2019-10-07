import { Entity } from './entity';
import { User } from './user';
import { StreamerPoll } from './streamer-poll';
import { StreamerPollRequest } from './streamer-poll-request';

export class StreamerPollVote implements Entity {
  id?: number;
  streamerPollRequest: StreamerPollRequest;
  user: User;

  createdAt?: Date;
  createdBy?: User;
  updatedAt?: Date;

  constructor(obj: StreamerPollVote) {
    Object.assign(this, obj);

    if (obj.createdBy) {
      this.createdBy = new User(obj.createdBy);
    }
    if (obj.streamerPollRequest) {
      this.streamerPollRequest = new StreamerPollRequest(obj.streamerPollRequest);
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
  }
}

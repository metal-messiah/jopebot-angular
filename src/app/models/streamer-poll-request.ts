import { Entity } from './entity';
import { User } from './user';
import { StreamerPollVote } from './streamer-poll-vote';
import { Request } from './request';

export class StreamerPollRequest implements Entity {
  id?: number;
  request?: Request;
  votes: StreamerPollVote[];
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
    if (obj.votes && obj.votes.length) {
      this.votes = obj.votes.map(vote => new StreamerPollVote(vote));
    }
    if (obj.createdAt) {
      this.createdAt = new Date(obj.createdAt);
    }
    if (obj.updatedAt) {
      this.updatedAt = new Date(obj.updatedAt);
    }
  }
}

import { Entity } from './entity';
import { User } from './user';
export class StreamerPollVote implements Entity {
  id?: number;
  user: User;
  streamerPollRequestId: number;

  createdAt?: Date;
  createdBy?: User;
  updatedAt?: Date;

  constructor(obj: StreamerPollVote) {
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
  }
}

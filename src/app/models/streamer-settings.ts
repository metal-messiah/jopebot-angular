import { Entity } from './entity';
import { User } from './user';

export class StreamerSettings implements Entity {
  id?: number;
  user: User;
  allowChatRequests?: boolean;
  requestAlias?: string;
  requestsPerUser?: number;
  requestQueueLimit?: number;
  isPaused?: boolean;

  createdAt?: Date;
  createdBy?: User;
  updatedAt?: Date;

  constructor(obj: StreamerSettings) {
    Object.assign(this, obj);
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

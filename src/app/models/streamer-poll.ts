import { Entity } from './entity';
import { User } from './user';

export class StreamerPoll implements Entity {
  id?: number;
  createdAt?: Date;
  createdBy?: User;
  updatedAt?: Date;
  user?: User;
  isOpen?: boolean;

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
  }
}

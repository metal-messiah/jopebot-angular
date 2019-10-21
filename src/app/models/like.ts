import { Entity } from './entity';
import { User } from './user';
import { Request } from './request';

export class Like implements Entity {
  id?: number;
  createdAt?: Date;
  createdBy?: User;
  updatedAt?: Date;
  user?: User;
  request?: Request;

  constructor(obj: Like) {
    Object.assign(this, obj);

    if (obj.createdBy) {
      this.createdBy = new User(obj.createdBy);
    }
    if (obj.request) {
      this.request = new Request(obj.request);
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

import { UserRole } from 'app/enums/user-role';
import { Provider } from 'app/enums/provider';

export class User {
  bio?: string;
  displayName?: string;
  email?: string;
  id?: number;
  logo?: string;
  username?: string;

  role?: UserRole;

  provider?: Provider;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(obj: User) {
    Object.assign(this, obj);
    if (obj.createdAt) {
      this.createdAt = new Date(obj.createdAt);
    }
    if (obj.updatedAt) {
      this.updatedAt = new Date(obj.updatedAt);
    }
  }
}

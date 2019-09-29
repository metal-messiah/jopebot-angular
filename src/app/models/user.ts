export class User {
  bio: string;
  createdAt: Date;
  displayName: string;
  email: string;
  id: number;
  logo: string;
  updatedAt: Date;
  username: string;

  constructor(obj: User) {
    Object.assign(this, obj);
  }
}

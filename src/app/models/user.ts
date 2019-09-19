export class User {
  bio: string;
  created_at: Date;
  created_by: number; // replace with User Object when join is ready
  display_name: string;
  email: string;
  id: number;
  logo: string;
  updated_at: Date;
  username: string;

  constructor(obj: User) {
    Object.assign(this, obj);
  }
}

import { Entity } from './entity';

export class UserState implements Entity {
  id: number;
  badges: { broadcaster: string };
  badgesRaw: string;
  color: string;
  displayName: string;
  emotes: any;
  emotesRaw: any;
  flags: any;
  messageType: string;
  mod: boolean;
  roomId: number;
  subscriber: boolean;
  tmiSentTs: string;
  turbo: boolean;
  userId: number;
  userType: any;
  username: string;

  constructor(obj: UserState) {
    obj.id = Number(obj.id);
    obj.userId = Number(obj.userId);
    obj.roomId = Number(obj.roomId);
    Object.assign(this, obj);
  }
}

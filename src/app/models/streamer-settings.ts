import { Entity } from "./entity";
import { User } from "./user";

export class StreamerSettings implements Entity {
  id?: number;
  user: User;
  allowChatRequests?: boolean;
  customInfoMessage?: string;
  hideChatMessages?: boolean;
  infoMessageChats?: number;
  infoMessageSeconds?: number;
  botVoiceName?: string;
  botVoiceOnRequest?: boolean;
  botVoicePitch?: number;
  botVoiceVolume?: number;
  botVoiceRate?: number;
  profanityFilter?: boolean;
  requestAlias?: string;
  requestCharacterLimit?: number;
  requestsPerUser?: number;

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

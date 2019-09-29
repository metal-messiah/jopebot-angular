import { Entity } from "./entity";
import { User } from "./user";

export class StreamerSettings implements Entity {
  id: number;
  user: User;
  allowChatRequests: boolean;
  customInfoMessage: string;
  hideChatMessages: boolean;
  infoMessageChats: number;
  infoMessageSeconds: number;
  botVoiceName: string;
  botVoiceOnRequest: boolean;
  botVoicePitch: number;
  botVoiceVolume: number;
  botVoiceRate: number;
  profanityFilter: boolean;
  requestAlias: string;
  requestCharacterLimit: number;
  requestsPerUser: number;

  createdBy: User;

  constructor(obj: StreamerSettings) {
    Object.assign(this, obj);
  }
}

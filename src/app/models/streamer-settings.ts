import { Entity } from "./entity";

export class StreamerSettings implements Entity {
  id: number;
  user_id: number;
  allow_chat_requests: boolean;
  custom_info_message: string;
  hide_chat_messages: boolean;
  info_message_chats: number;
  info_message_seconds: number;
  bot_voice_name: string;
  bot_voice_on_request: boolean;
  bot_voice_pitch: number;
  bot_voice_volume: number;
  bot_voice_rate: number;
  profanity_filter: boolean;
  request_alias: string;
  request_character_limit: number;
  requests_per_user: number;

  created_by: number;

  constructor(obj: StreamerSettings) {
    Object.assign(this, obj);
  }
}

import { Entity } from '../entity';
export class StreamerPollVote implements Entity {
  id?: number;
  user_id: number;
  streamer_poll_request_id: number;

  constructor(obj: StreamerPollVote) {
    Object.assign(this, obj);
  }
}

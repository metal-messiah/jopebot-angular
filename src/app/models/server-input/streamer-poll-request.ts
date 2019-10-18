import { Entity } from '../entity';
import { Request } from '../request';
import { StreamerPoll } from '../streamer-poll';

export class StreamerPollRequest implements Entity {
  id?: number;
  request_id?: number;
  streamer_poll_id: number;

  constructor(obj: StreamerPollRequest) {
    Object.assign(this, obj);
  }
}

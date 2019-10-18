import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { CrudService } from '../../interfaces/crud-service';
import { tables } from 'app/enums/tables';
import { StreamerPollVote } from 'app/models/streamer-poll-vote';
import { StreamerPollVote as InputPollVote } from 'app/models/server-input/streamer-poll-vote';

@Injectable({
  providedIn: 'root'
})
export class StreamerPollsVotesService extends CrudService<StreamerPollVote | InputPollVote> {
  table: tables = tables.streamer_polls_votes;
  endpoint = `/api/${this.table}`;

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  protected createEntityFromObj(entityObj): StreamerPollVote {
    return new StreamerPollVote(entityObj);
  }
}

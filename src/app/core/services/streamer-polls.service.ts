import { Injectable } from '@angular/core';
import { User } from 'app/models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { CrudService } from '../../interfaces/crud-service';
import { StreamerSettings } from 'app/models/streamer-settings';
import { tables } from 'app/enums/tables';
import { StreamerPoll } from 'app/models/streamer-poll';
import { StreamerPollResult } from 'app/models/streamer-poll-result';

@Injectable({
  providedIn: 'root'
})
export class StreamerPollsService extends CrudService<StreamerPoll> {
  table: tables = tables.streamer_polls;
  endpoint = `/api/${this.table}`;

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  getPollResults(pollId: number): Observable<StreamerPollResult> {
    const url = this.rest.getHost() + `/api/streamer-polls/${pollId}/results`;
    return this.http.get<StreamerPollResult>(url, { withCredentials: true });
  }

  protected createEntityFromObj(entityObj): StreamerPoll {
    return new StreamerPoll(entityObj);
  }
}

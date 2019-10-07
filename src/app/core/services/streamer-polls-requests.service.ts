import { Injectable } from '@angular/core';
import { User } from 'app/models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { CrudService } from '../../interfaces/crud-service';
import { StreamerSettings } from 'app/models/streamer-settings';
import { tables } from 'app/enums/tables';
import { StreamerPollRequest } from 'app/models/streamer-poll-request';

@Injectable({
  providedIn: 'root'
})
export class StreamerPollsRequestsService extends CrudService<StreamerPollRequest> {
  table: tables = tables.streamer_polls_requests;
  endpoint = `/api/${this.table}`;

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  protected createEntityFromObj(entityObj): StreamerPollRequest {
    return new StreamerPollRequest(entityObj);
  }
}

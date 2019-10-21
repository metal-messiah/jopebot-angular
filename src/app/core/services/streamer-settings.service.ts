import { Injectable } from '@angular/core';
import { User } from 'app/models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { CrudService } from '../../interfaces/crud-service';
import { StreamerSettings } from 'app/models/streamer-settings';
import { Tables } from 'app/enums/tables';

@Injectable({
  providedIn: 'root'
})
export class StreamerSettingsService extends CrudService<StreamerSettings> {
  table: Tables = Tables.streamer_settings;
  endpoint = `/api/${this.table}`;

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  protected createEntityFromObj(entityObj): StreamerSettings {
    return new StreamerSettings(entityObj);
  }
}

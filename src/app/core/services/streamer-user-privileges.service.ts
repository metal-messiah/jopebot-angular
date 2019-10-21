import { Injectable } from '@angular/core';
import { User } from 'app/models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { CrudService } from '../../interfaces/crud-service';
import { StreamerUserPrivilege } from 'app/models/streamer-user-privilege';
import { Tables } from 'app/enums/tables';

@Injectable({
  providedIn: 'root'
})
export class StreamerUserPrivilegesService extends CrudService<StreamerUserPrivilege> {
  table: Tables = Tables.streamer_user_privileges;
  endpoint = `/api/${this.table}`;

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  protected createEntityFromObj(entityObj): StreamerUserPrivilege {
    return new StreamerUserPrivilege(entityObj);
  }
}

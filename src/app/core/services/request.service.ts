import { Injectable } from '@angular/core';
import { User } from 'app/models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { CrudService } from '../../interfaces/crud-service';
import { Request } from '../../models/request';
import { Tables } from 'app/enums/tables';

@Injectable({
  providedIn: 'root'
})
export class RequestService extends CrudService<Request> {
  table: Tables = Tables.requests;
  endpoint = `/api/${this.table}`;

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  protected createEntityFromObj(entityObj): Request {
    return new Request(entityObj);
  }
}

import { Injectable } from '@angular/core';
import { User } from 'app/models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { CrudService } from '../../interfaces/crud-service';
import { Like } from '../../models/like';
import { Tables } from 'app/enums/tables';

@Injectable({
  providedIn: 'root'
})
export class LikesService extends CrudService<Like> {
  table: Tables = Tables.likes;
  endpoint = `/api/${this.table}`;

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  protected createEntityFromObj(entityObj): Like {
    return new Like(entityObj);
  }
}

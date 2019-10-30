import { Injectable } from '@angular/core';
import { User } from 'app/models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { CrudService } from '../../interfaces/crud-service';
import { StreamerSong } from 'app/models/streamer-song';
import { Tables } from 'app/enums/tables';

@Injectable({
  providedIn: 'root'
})
export class StreamerSongsService extends CrudService<StreamerSong> {
  table: Tables = Tables.streamer_songs;
  endpoint = `/api/${this.table}`;

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  protected createEntityFromObj(entityObj): StreamerSong {
    return new StreamerSong(entityObj);
  }

  submitForm(userId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(this.rest.getHost() + `/api/streamer-songs/${userId}/submit-form`, formData, {
      withCredentials: true
    });
  }
}

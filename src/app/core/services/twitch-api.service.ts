import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RestService } from './rest.service';
import { forkJoin, Observable } from 'rxjs';
import { User } from 'app/models/user';

@Injectable()
export class TwitchApiService {
  constructor(private http: HttpClient, private rest: RestService) {}

  getUserIdsFromUsernames(usernames: string[]): Observable<User[]> {
    const url = this.rest.getHost() + `/api/twitch-api/get-user-ids`;
    const names = encodeURI(usernames.join(','));
    const params = new HttpParams().set('usernames', names);
    return this.http.get<User[]>(url, { withCredentials: true, params: params });
  }
}

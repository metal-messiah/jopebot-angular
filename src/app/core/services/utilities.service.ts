import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable()
export class UtilitiesService {
  constructor(private http: HttpClient, private rest: RestService) {}

  requestHelp(message: string): Observable<void> {
    const url = this.rest.getHost() + `/api/utilities/help`;
    return this.http.post<void>(url, { message }, { withCredentials: true });
  }
}

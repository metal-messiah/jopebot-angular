import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { User } from 'app/models/user';
import { StorageService } from './storage.service';

@Injectable()
export class UtilitiesService {
  constructor(private http: HttpClient, private rest: RestService) {}

  requestHelp(message: string): Observable<void> {
    const url = this.rest.getHost() + `/api/utilities/help`;
    return this.http.post<void>(url, { message }, { withCredentials: true });
  }
}

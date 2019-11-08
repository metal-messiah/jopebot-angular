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
import { Provider } from '../../enums/provider';

@Injectable()
export class AuthService {
  private _currentUser: User;

  constructor(private http: HttpClient, private rest: RestService, private storageService: StorageService) {
    this.fetchCurrentUserFromDB().subscribe((user: User) => {
      console.log(user);
      if (user) {
        this.currentUser = user;
      }
    });
  }

  signIn(provider: Provider, target?: string): void {
    const path = this.getSignInPath(provider, target);
    window.location.href = path;
  }

  getSignInPath(provider: Provider, target?: string): string {
    return `${this.rest.getHost()}/api/auth/${provider}/login${target ? `?target=${encodeURI(target)}` : ''}`;
  }

  handleAuthentication(): void {}

  onError(err): void {}

  logout(): Observable<void> {
    const url = this.rest.getHost() + `/api/auth/logout`;
    return this.http.get<void>(url, { withCredentials: true });
    // window.location.href = this.rest.getHost() + "/api/auth/logout";
  }

  isAuthenticated(): Observable<boolean> {
    const url = this.rest.getHost() + `/api/auth/is-authenticated`;
    return this.http.get<boolean>(url, { withCredentials: true });
  }

  fetchCurrentUserFromDB(): Observable<User> {
    const url = this.rest.getHost() + `/api/auth/current-user`;
    return this.http.get<User>(url, { withCredentials: true });
  }

  get currentUser() {
    return this._currentUser;
  }

  set currentUser(user: User) {
    this._currentUser = user;
  }
}

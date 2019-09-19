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

@Injectable()
export class AuthService {
  private _currentUser: User;

  constructor(
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private rest: RestService,
    private dialog: MatDialog
  ) {
    console.log('AUTH SERVICE!');
    this.fetchCurrentUserFromDB().subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
        console.log('set current user!');
      }
    });
  }

  signIn(): void {
    console.log('force sign in!');
    window.location.href = this.rest.getHost() + '/api/auth';

    // this.storageService.set(this.ST_LATEST_PATH, this.location.path()).subscribe();
    // this.auth0.authorize();
  }

  handleAuthentication(): void {}

  onError(err): void {}

  // private getUserProfile(): Observable<UserProfile> {
  //   const url = this.rest.getHost() + `/api/auth/user`;
  //   return this.http.get<UserProfile>(url, { headers: this.rest.getHeaders() });
  // }

  logout(): void {
    // const tasks = [];
    // tasks.push(this.storageService.removeOne(this.ST_SESSION_USER));
    // tasks.push(this.storageService.removeOne(this.ST_ACCESS_TOKEN));
    // tasks.push(this.storageService.removeOne(this.ST_ID_TOKEN));
    // tasks.push(this.storageService.removeOne(this.ST_EXPIRATION_TIME));
    // tasks.push(this.storageService.removeOne(this.ST_LATEST_PATH));
    // forkJoin(tasks).subscribe(() => {
    //   this.router.navigate(['/']);
    //   location.reload();
    // });
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

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as auth0 from "auth0-js";
import { environment } from "../../../environments/environment";
import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { RestService } from "./rest.service";
import { MatDialog } from "@angular/material/dialog";
import { forkJoin, Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { User } from "app/models/user";

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
    console.log("AUTH SERVICE!");
    this.fetchCurrentUserFromDB().subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
        console.log("set current user!");
      }
    });
  }

  signIn(target?: string): void {
    const path = `${this.rest.getHost()}/api/auth${
      target ? `?target=${encodeURI(target)}` : ""
    }`;
    console.log(path);
    window.location.href = path;
  }

  handleAuthentication(): void {}

  onError(err): void {}

  logout(): void {
    window.location.href = this.rest.getHost() + "/api/auth/logout";
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

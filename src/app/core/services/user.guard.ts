import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { UserService } from "./user.service";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const { userid } = next.params;
    return this.userService.exists(userid).pipe(
      tap(exists => {
        console.log("USER EXISTS? ", exists);
      })
    );
  }
}

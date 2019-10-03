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
import { RequestService } from "./request.service";

@Injectable()
export class OwnedGuard implements CanActivate {
  constructor(private requestService: RequestService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log("OWNED GUARD!");
    if (next.params.requestid) {
      return this.requestService.isOwned(next.params.requestid);
    }
  }
}

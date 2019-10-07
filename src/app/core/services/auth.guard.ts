import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'app/models/user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.currentUser) {
      return this.authService.isAuthenticated().pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.authService.signIn(state.url);
          }
        })
      );
    } else {
      const promise: Promise<boolean> = new Promise((resolve, reject) => {
        this.authService.fetchCurrentUserFromDB().subscribe((user: User) => {
          if (user) {
            resolve(true);
          } else {
            this.authService.signIn(state.url);
            resolve(false);
          }
        });
      });
      return promise;
    }
  }
}

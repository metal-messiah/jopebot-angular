import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'app/models/user';
import { UserRole } from 'app/enums/user-role';
import { BotService } from './bot.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private botService: BotService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      if (this.authService.currentUser) {
        this.isElevated(this.authService.currentUser, next).then(isElevated => {
          if (!isElevated) {
            this.router.navigate(['not-authorized']);
          }
          resolve(isElevated);
        });
      } else {
        this.authService.fetchCurrentUserFromDB().subscribe((user: User) => {
          if (user) {
            this.isElevated(this.authService.currentUser, next).then(isElevated => {
              if (!isElevated) {
                this.router.navigate(['not-authorized']);
              }
              resolve(isElevated);
            });
          } else {
            this.router.navigate(['not-authorized']);
            resolve(false);
          }
        });
      }
    });
    return promise;
  }

  isElevated(user: User, next): Promise<boolean> {
    const { userid } = next.params;
    return this.botService.hasAccess(userid); // returns a promise
  }
}

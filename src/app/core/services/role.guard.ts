import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'app/models/user';
import { UserRole } from 'app/enums/user-role';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.currentUser) {
      const isElevated = this.isElevated(this.authService.currentUser);
      if (!isElevated) {
        this.router.navigate(['not-authorized']);
      }
      return isElevated;
    } else {
      const promise: Promise<boolean> = new Promise((resolve, reject) => {
        this.authService.fetchCurrentUserFromDB().subscribe((user: User) => {
          if (user) {
            console.log(user);
            const isElevated = this.isElevated(this.authService.currentUser);
            resolve(isElevated);
          } else {
            this.router.navigate(['not-authorized']);
            resolve(false);
          }
        });
      });
      return promise;
    }
  }

  isElevated(user: User): boolean {
    return user.role === UserRole.ADMIN || user.role === UserRole.STAFF;
  }
}

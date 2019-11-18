import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from 'app/models/user';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { Provider } from 'app/enums/provider';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private dialog: MatDialog) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.currentUser) {
      const promise: Promise<boolean> = new Promise((resolve, reject) => {
        this.authService.isAuthenticated().subscribe(resp => {
          console.log(resp);
          if (!resp.isAuthenticated) {
            this.chooseProvider(state.url);
            resolve(false);
          } else {
            // is authenticated, do they have tokens?
            if (!resp.hasTokens) {
              console.log('NO TOKENS!');
              this.authService.signIn(Provider.twitch, state.url);
              resolve(false);
            } else {
              resolve(true);
            }
          }
        });
      });
      return promise;
    } else {
      const promise: Promise<boolean> = new Promise((resolve, reject) => {
        this.authService.fetchCurrentUserFromDB().subscribe((user: User) => {
          if (user) {
            resolve(true);
          } else {
            console.log('NO USER');
            // this.authService.signIn(state.url);
            this.chooseProvider(state.url);
            resolve(false);
          }
        });
      });
      return promise;
    }
  }

  chooseProvider(target: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Sign In',
          options: ['<i class="fab fa-twitch"></i> Twitch', '<i class="fab fa-microsoft"></i> Mixer'],
          optionsColors: ['#6441a5', '#1fbaed']
        }
      })
      .afterClosed()
      .subscribe((provider?: string) => {
        if (provider.toLowerCase().includes(Provider.mixer)) {
          this.authService.signIn(Provider.mixer, target);
        }
        if (provider.toLowerCase().includes(Provider.twitch)) {
          this.authService.signIn(Provider.twitch, target);
        }
      });
  }
}

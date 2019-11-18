import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { trigger, transition, useAnimation } from '@angular/animations';
import { flipInY, fadeIn, rubberBand, slideInUp } from 'ng-animate';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { Provider } from './enums/provider';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp))]),
    trigger('flipInY', [transition('* => *', useAnimation(flipInY))]),
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))])
  ]
})
export class AppComponent implements OnInit {
  checkedLogin = false;
  isAuthenticated;

  constructor(
    private _location: Location,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    const isAuthenticated = await this.auth.isAuthenticated().toPromise();
    this.isAuthenticated = isAuthenticated.isAuthenticated;
    this.checkedLogin = true;
  }

  goHome() {
    this.router.navigate(['']);
  }

  isHomePage() {
    return this._location.isCurrentPathEqualTo('');
  }

  logout() {
    if (confirm('Are you sure you want to log out?')) {
      this.auth.logout().subscribe(() => {
        this.router.navigate(['home'], { relativeTo: this.route });
        this.auth.currentUser = null;
      });
    }
  }

  login(provider: Provider) {
    this.auth.signIn(provider);
  }

  goBack() {
    this._location.back();
  }

  getAuthText(): string {
    if (!this.auth.currentUser && this.checkedLogin) {
      return '<i class="fab fa-twitch"></i> <i class="fab fa-microsoft"></i>';
    }
    if (!this.checkedLogin) {
      return 'Connecting...';
    }
    return `${this.auth.currentUser.username}`;
  }

  getAuthIconPulse(): boolean {
    return !this.checkedLogin;
  }

  getActionText(): string {
    if (this.checkedLogin && !this.auth.currentUser) {
      return 'Sign In';
    }
    if (this.checkedLogin && this.auth.currentUser) {
      return 'Log Out';
    }
  }

  getAction(): void {
    if (this.auth.currentUser) {
      return this.logout();
    } else {
      return this.chooseProvider();
    }
  }

  chooseProvider() {
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
          this.login(Provider.mixer);
        }
        if (provider.toLowerCase().includes(Provider.twitch)) {
          this.login(Provider.twitch);
        }
      });
  }
}

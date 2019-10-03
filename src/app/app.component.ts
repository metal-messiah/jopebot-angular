import { Component, OnInit } from "@angular/core";
import { AuthService } from "./core/services/auth.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

import { trigger, transition, useAnimation } from "@angular/animations";
import { flipInY, fadeIn, rubberBand, slideInUp } from "ng-animate";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [
    trigger("slideInUp", [transition("* => *", useAnimation(slideInUp))]),
    trigger("flipInY", [transition("* => *", useAnimation(flipInY))]),
    trigger("fadeIn", [transition("* => *", useAnimation(fadeIn))])
  ]
})
export class AppComponent implements OnInit {
  checkedLogin = false;

  constructor(
    private _location: Location,
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.auth.isAuthenticated();
    this.checkedLogin = true;
  }

  goHome() {
    this.router.navigate([""]);
  }

  isHomePage() {
    return this._location.isCurrentPathEqualTo("");
  }

  logout() {
    if (confirm("Are you sure you want to log out?")) {
      this.auth.logout();
    }
  }

  login() {
    this.auth.signIn();
  }

  goBack() {
    this._location.back();
  }

  getAuthText(): string {
    if (!this.auth.currentUser && this.checkedLogin) {
      return "Twitch.tv";
    }
    if (!this.checkedLogin) {
      return "Connecting to Twitch.tv...";
    }
    return `${this.auth.currentUser.username}`;
  }

  getAuthIcon(): string[] {
    if (!this.auth.currentUser && this.checkedLogin) {
      return ["fab", "twitch"];
    }
    if (!this.checkedLogin) {
      return ["fas", "spinner"];
    }
    return ["fas", "user"];
  }

  getAuthIconPulse(): boolean {
    return !this.checkedLogin;
  }

  getActionText(): string {
    if (this.checkedLogin && !this.auth.currentUser) {
      return "Sign In";
    }
    if (this.checkedLogin && this.auth.currentUser) {
      return "Log Out";
    }
  }

  getAction(): void {
    if (this.auth.currentUser) {
      return this.logout();
    } else {
      return this.login();
    }
  }
}

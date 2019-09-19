import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/core/services/auth.service";
import { User } from "../../models/user";
import { UserService } from "app/core/services/user.service";

@Component({
  selector: "app-viewer-dashboard",
  templateUrl: "./viewer-dashboard.component.html",
  styleUrls: ["./viewer-dashboard.component.css"]
})
export class ViewerDashboardComponent implements OnInit {
  userFromId: User;
  errorMsg: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    if (!this.route.snapshot.paramMap.get("userid")) {
      console.log("NO USER ID!");
    }

    // Subscribed
    this.route.paramMap.subscribe(async params => {
      console.log("subscription!");
      const userIdParam = params.get("userid");
      this.userFromId = await this.userService
        .getOneById(userIdParam)
        .toPromise();
      if (!this.userFromId.hasOwnProperty("id")) {
        this.errorMsg = `${userIdParam} does not reference a valid user...`;
      }
    });
  }

  goto(userid: number): void {
    this.router.navigate([":userid", userid]);
  }
}

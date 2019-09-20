import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/core/services/auth.service";
import { User } from "../../models/user";
import { UserService } from "app/core/services/user.service";
import { StreamerSongsService } from "app/core/services/streamer-songs.service";
import { StreamerUserPrivilegesService } from "app/core/services/streamer-user-privileges.service";
import { StreamerSettingsService } from "app/core/services/streamer-settings.service";
import { RequestService } from "app/core/services/request.service";
import { Request } from "../../models/request";

@Component({
  selector: "app-viewer-dashboard",
  templateUrl: "./viewer-dashboard.component.html",
  styleUrls: ["./viewer-dashboard.component.css"]
})
export class ViewerDashboardComponent implements OnInit {
  userFromId: User;
  errorMsg: string;

  requestQueue: Request[] = [];
  playedRequests: Request[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private authService: AuthService,
    private userService: UserService,
    private requestService: RequestService,
    private streamerSettingsService: StreamerSettingsService,
    private streamerSongsService: StreamerSongsService,
    private streamerUserPrivilegesService: StreamerUserPrivilegesService
  ) {}

  async ngOnInit() {
    // Subscribed
    this.route.paramMap.subscribe(async params => {
      console.log("subscription!");
      const stremerIdParam = params.get("userid");
      this.userFromId = await this.userService
        .getOneById(stremerIdParam)
        .toPromise();
      if (!this.userFromId.hasOwnProperty("id")) {
        this.errorMsg = `${stremerIdParam} does not reference a valid user...`;
      } else {
        this.requestQueue = await this.requestService
          .getAll({ streamer_id: stremerIdParam, played: false })
          .toPromise();

        console.log(this.requestQueue);

        this.playedRequests = await this.requestService
          .getAll({ streamer_id: stremerIdParam, played: true })
          .toPromise();
        console.log(this.playedRequests);
      }
    });
  }

  goto(userid: number): void {
    this.router.navigate([":userid", userid]);
  }
}

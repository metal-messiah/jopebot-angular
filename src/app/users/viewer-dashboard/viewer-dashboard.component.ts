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
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import eh from "../../interfaces/error-handler";

import { trigger, transition, useAnimation } from "@angular/animations";
import { zoomIn } from "ng-animate";
import { StreamerSong } from "app/models/streamer-song";
@Component({
  selector: "app-viewer-dashboard",
  templateUrl: "./viewer-dashboard.component.html",
  styleUrls: ["./viewer-dashboard.component.css"],
  animations: [trigger("zoomIn", [transition("* => *", useAnimation(zoomIn))])]
})
export class ViewerDashboardComponent implements OnInit {
  streamerIdParam: string;
  userFromId: User;
  errorMsg: string;

  fetching = {
    requestQueue: false,
    playedRequests: false,
    songs: false
  };

  requestQueue: Request[] = [];
  playedRequests: Request[] = [];
  songs: StreamerSong;

  downloadWarning = `CAUTION! SPOOPY! 
        These links could point anywhere, are provided by random people on the internet, and are in no way affiliated with JopeBot.  Proceed with caution.`;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private authService: AuthService,
    private userService: UserService,
    private requestService: RequestService,
    private streamerSettingsService: StreamerSettingsService,
    private streamerSongsService: StreamerSongsService,
    private streamerUserPrivilegesService: StreamerUserPrivilegesService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {}

  async ngOnInit() {
    // Subscribed
    this.route.paramMap.subscribe(async params => {
      this.streamerIdParam = params.get("userid");
      await this.getUserFromId(this.streamerIdParam);
      if (this.userFromId) {
        this.updateRequestQueue();
        this.updatePlayedRequests();
        this.updateSongs();
      }
    });
  }

  async getUserFromId(id: string | number) {
    let [error, user] = await eh(
      this.userService.getOneById(this.streamerIdParam).toPromise()
    );
    if (error) {
      this.setErrorMsg(
        `${this.streamerIdParam} does not reference a valid user...`
      );
    } else {
      this.userFromId = user;
    }
  }

  setErrorMsg(msg: string) {
    this.errorMsg = msg;
  }

  sortByDateField(list: any[], property: string, asc: boolean) {
    list.sort((a, b) => {
      if (asc) {
        return Number(new Date(a[property])) - Number(new Date(b[property]));
      } else {
        return Number(new Date(b[property])) - Number(new Date(a[property]));
      }
    });
  }

  async updateRequestQueue() {
    this.fetching.requestQueue = true;
    this.requestQueue = await this.requestService
      .getAll({ streamer_id: this.streamerIdParam, played: null })
      .toPromise();
    this.sortByDateField(this.requestQueue, "createdAt", true);
    this.fetching.requestQueue = false;
  }

  async updatePlayedRequests() {
    this.fetching.playedRequests = true;
    this.playedRequests = await this.requestService
      .getAll({ streamer_id: this.streamerIdParam, "played !=": null })
      .toPromise();
    this.sortByDateField(this.playedRequests, "played", false);
    this.fetching.playedRequests = false;
  }

  async updateSongs() {
    console.log("update songs");
    this.fetching.songs = true;
    const resp = await this.streamerSongsService
      .getAll({ user_id: this.streamerIdParam })
      .toPromise();
    this.songs = resp.length ? resp[0] : null;
    this.fetching.songs = false;
  }

  shouldDisableMenu(request: Request) {
    return request.createdBy.id !== this.authService.currentUser.id;
  }

  openLink(link: string) {
    if (confirm(this.downloadWarning)) {
      window.open(link, "_blank");
    }
  }

  downloadAttachment(attachment: string) {
    if (confirm(this.downloadWarning)) {
      window.open(attachment, "_blank");
    }
  }

  scrollTo(elemId: string) {
    const elem = document.getElementById(elemId);
    elem.scrollIntoView({ behavior: "smooth" });
  }

  newRequest() {
    this.router.navigate(["request"], { relativeTo: this.route });
  }
}

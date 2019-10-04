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
import { MatDialog } from "@angular/material";
import { ConfirmDialogComponent } from "app/shared/confirm-dialog/confirm-dialog.component";
import { DisplayDialogComponent } from "app/shared/display-dialog/display-dialog.component";
import { SocketService } from "app/core/services/socket.service";
import { StreamerSettings } from "app/models/streamer-settings";
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

  menuTarget: Request;

  fetching = {
    requestQueue: false,
    playedRequests: false,
    songs: false
  };

  requestQueue: Request[] = [];
  playedRequests: Request[] = [];
  songs: StreamerSong;

  streamerSettings: StreamerSettings;
  userRequests: number = 0;

  downloadWarning = `These links could point anywhere, are provided by random people on the internet, and are in no way affiliated with JopeBot.
  
  Do You Wish To Continue?`;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private authService: AuthService,
    private userService: UserService,
    private requestService: RequestService,
    private streamerSongsService: StreamerSongsService,
    private dialog: MatDialog,
    private socketService: SocketService,
    private streamerSettingsService: StreamerSettingsService
  ) {}

  async ngOnInit() {
    // Subscribed
    this.route.paramMap.subscribe(async params => {
      this.streamerIdParam = params.get("userid");
      await this.getUserFromId(this.streamerIdParam);
      if (this.userFromId) {
        this.refreshData();
      }
    });

    // subscribe to socket refresh!
    this.socketService.refreshDatasets$.subscribe(() => {
      this.refreshData();
    });
  }

  canRequest(): boolean {
    if (this.streamerSettings) {
      return this.streamerSettings.requestsPerUser > this.userRequests;
    }
    return false;
  }

  refreshData() {
    this.getAllRequests();
    this.getCounts();
  }

  getCounts() {
    this.streamerSettingsService
      .getAll({ user_id: this.authService.currentUser.id })
      .subscribe((streamerSettings: StreamerSettings[]) => {
        if (streamerSettings.length) {
          this.streamerSettings = streamerSettings[0];
        }
      });

    this.requestService
      .count({
        user_id: this.authService.currentUser.id,
        streamer_id: this.streamerIdParam
      })
      .subscribe(count => {
        this.userRequests = count;
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

  async getAllRequests() {
    this.fetching.requestQueue = true;
    this.fetching.playedRequests = true;

    const allRequests = await this.requestService
      .getAll({ streamer_id: this.streamerIdParam })
      .toPromise();

    this.requestQueue = allRequests.filter(r => !r.played);
    this.playedRequests = allRequests.filter(r => r.played);

    this.sortByDateField(this.requestQueue, "createdAt", true);
    this.sortByDateField(this.playedRequests, "played", false);

    this.fetching.requestQueue = false;
    this.fetching.playedRequests = false;
  }

  shouldDisableMenu(request: Request) {
    return request.createdBy.id !== this.authService.currentUser.id;
  }

  openLink(link: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: { title: "Caution! SpOOpy!", question: this.downloadWarning }
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          window.open(link, "_blank");
        }
      });
  }

  scrollTo(elemId: string) {
    const elem = document.getElementById(elemId);
    elem.scrollIntoView({ behavior: "smooth" });
  }

  newRequest() {
    this.router.navigate(["request"], { relativeTo: this.route });
  }

  showSongInfo(song: string) {
    if (song) {
      const json = JSON.parse(song);
      const content = Object.keys(json)
        .map(key => `${key}: ${json[key]}`)
        .join("\n");
      this.dialog
        .open(DisplayDialogComponent, { data: { title: "Info", content } })
        .afterClosed()
        .subscribe(result => {
          if (result) {
          }
        });
    }
  }

  getRequestMessage(request: Request) {
    if (request.message) return request.message;

    if (request.song) {
      const json = JSON.parse(request.song);
      if (json.Name) return json.Name;
      if (json.name) return json.name;
      if (json.songName) return json.songName;

      return json[Object.keys(json)[0]];
    }

    if (request.link) {
      return request.link;
    }
  }

  setMenuTarget(request: Request) {
    this.menuTarget = request;
  }

  editRequest() {
    const targetRequest: Request = this.menuTarget;
    this.router.navigate(["request", targetRequest.id], {
      relativeTo: this.route
    });
  }

  deleteRequest() {
    const targetRequest: Request = this.menuTarget;
    this.requestService.delete(targetRequest.id).subscribe(() => {
      console.log("Deleted Request!");
      this.refreshData();
    });
  }
}

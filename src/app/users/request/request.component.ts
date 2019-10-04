import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StreamerSongsService } from "app/core/services/streamer-songs.service";
import { StreamerSong } from "app/models/streamer-song";
import { FormControl, Validators } from "@angular/forms";

import { debounceTime } from "rxjs/internal/operators";

import * as Fuse from "fuse.js";
import { UserService } from "app/core/services/user.service";
import { User } from "app/models/user";
import { AuthService } from "app/core/services/auth.service";
import { Request } from "app/models/request";
import { RequestService } from "app/core/services/request.service";

import { Location } from "@angular/common";
import { StreamerSettingsService } from "app/core/services/streamer-settings.service";
import { StreamerSettings } from "app/models/streamer-settings";
import { tables } from "app/enums/tables";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.css"]
})
export class RequestComponent implements OnInit {
  streamerIdParam;
  requestIdParam;

  fetching = { songs: false };
  submitting = false;
  songs: StreamerSong;

  display: any[] = [];

  selectIsOpen = false;

  selectedSong;

  dataFields: string[] = [];

  fieldsControl: FormControl;
  textControl: FormControl;
  customMessageControl: FormControl;
  linkControl: FormControl;

  streamerSettings: StreamerSettings;
  userRequests: number;

  fuse: Fuse<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private streamerSongsService: StreamerSongsService,
    private userService: UserService,
    private authService: AuthService,
    private requestService: RequestService,
    private streamerSettingsService: StreamerSettingsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.streamerIdParam = params.get("userid");
      this.requestIdParam = params.get("requestid");
      if (this.requestIdParam) {
        this.populateForms();
      }
      this.fetchSongs();

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
    });

    this.textControl = new FormControl("");
    this.textControl.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.search(val);
    });

    this.customMessageControl = new FormControl("", [Validators.required]);
    this.linkControl = new FormControl("", [
      Validators.required,
      Validators.pattern(
        "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
      )
    ]);
  }

  populateForms() {
    this.requestService
      .getOneById(this.requestIdParam)
      .subscribe((request: Request) => {
        this.customMessageControl.setValue(request.message);
        this.linkControl.setValue(request.link);
        this.selectedSong = request.song ? JSON.parse(request.song) : null;
      });
  }

  async fetchSongs() {
    this.fetching.songs = true;
    this.streamerSongsService
      .getAll({ user_id: this.streamerIdParam })
      .subscribe((resp: StreamerSong[]) => {
        if (resp) {
          this.songs = resp.length ? resp[0] : null;
          this.fetching.songs = false;

          this.dataFields = this.songs
            ? Object.keys(
                this.songs.data.length ? this.songs.data[0] : this.songs.data
              )
            : [];
          this.display = this.songs
            ? this.songs.data.length
              ? this.songs.data
              : [this.songs.data]
            : [];

          // by default show 6 fields
          this.fieldsControl = new FormControl(this.dataFields.slice(0, 4), [
            Validators.required
          ]);
        }
        this.fetching.songs = false;
      });
  }

  getRowWidth(): string {
    return `${window.innerWidth / this.fieldsControl.value.length - 10}px`;
  }

  onBlur() {
    this.selectIsOpen = false;
  }

  onFocus() {
    this.selectIsOpen = true;
  }

  search(term: string) {
    if (term) {
      const options = {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: this.dataFields
      };
      this.fuse = new Fuse(this.songs.data, options); // "list" is the item array
      this.display = this.fuse.search(term);
    } else {
      this.display = this.songs.data.length
        ? this.songs.data
        : [this.songs.data];
    }
  }

  onSongClick(song: any) {
    this.selectedSong = song;
  }

  isSong(song: any) {
    return JSON.stringify(this.selectedSong) === JSON.stringify(song);
  }

  shouldDisableNewRequest(): boolean {
    return (
      this.submitting ||
      (!this.selectedSong &&
        !this.customMessageControl.valid &&
        !this.linkControl.valid)
    );
  }

  submitNewRequest() {
    if (
      this.streamerSettings.requestsPerUser > this.userRequests &&
      !this.requestIdParam
    ) {
      this.submitting = true;
      const song: string = this.selectedSong
        ? JSON.stringify(this.selectedSong)
        : null;
      const link: URL = this.linkControl.valid ? this.linkControl.value : null;
      const message: string = this.customMessageControl.value
        ? this.customMessageControl.value
        : null;

      this.userService
        .getOneById(this.streamerIdParam)
        .subscribe((user: User) => {
          const options = {
            id: this.requestIdParam,
            message: message || null,
            user: this.authService.currentUser,
            streamer: user,
            song: song,
            link: link
          };
          const request = new Request(options);

          if (request.id) {
            this.requestService.update(request).subscribe(resp => {
              // console.log(this.route, this.router);
              this.router.navigate(["/users", this.streamerIdParam]);
            });
          } else {
            this.requestService.create(request).subscribe(resp => {
              // console.log(this.route, this.router);
              this.router.navigate(["/users", this.streamerIdParam]);
            });
          }
        });
    } else {
      console.log("TOO MANY REQUESTS!");
    }
  }
}

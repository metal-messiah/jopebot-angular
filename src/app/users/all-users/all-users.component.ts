import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/core/services/auth.service";
import { User } from "../../models/user";
import { UserService } from "app/core/services/user.service";
import { SocketService } from "app/core/services/socket.service";
import * as Fuse from "fuse.js";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { StreamerSettingsService } from "app/core/services/streamer-settings.service";
import { StreamerSettings } from "app/models/streamer-settings";

@Component({
  selector: "app-all-users",
  templateUrl: "./all-users.component.html",
  styleUrls: ["./all-users.component.css"]
})
export class AllUsersComponent implements OnInit {
  onlineUsers: User[] = [];
  offlineUsers: User[] = [];

  onlineDisplay: User[] = [];
  offlineDisplay: User[] = [];

  openRooms: number[] = [];
  initializing = true;

  fuse: Fuse<any>;

  textControl: FormControl;

  constructor(
    private authService: AuthService,
    private streamerSettingsService: StreamerSettingsService,
    private userService: UserService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.textControl = new FormControl("");
    this.textControl.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.search(val);
    });
    this.refreshUsers();
  }

  refreshUsers() {
    this.socketService.getRoomIds().subscribe(
      (roomIds: number[]) => {
        this.openRooms = roomIds;
        this.streamerSettingsService.getAll().subscribe(
          (streamerSettings: StreamerSettings[]) => {
            const users = streamerSettings.map(ss => ss.user);
            const { online, offline } = this.partitionUsers(users);

            this.onlineUsers = online;
            this.sortByStringProperty(this.onlineUsers, "displayName");

            this.offlineUsers = offline;
            this.sortByStringProperty(this.offlineUsers, "displayName");

            this.onlineDisplay = this.onlineUsers;
            this.offlineDisplay = this.offlineUsers;

            this.initializing = false;
          },
          err => {
            console.log(err);
            this.initializing = false;
          }
        );
      },
      err => {
        console.log(err);
        this.initializing = false;
      }
    );
  }

  partitionUsers(users: User[]) {
    return {
      online: users.filter(user => this.isOnline(user)),
      offline: users.filter(user => !this.isOnline(user))
    };
  }

  isOnline(user: User) {
    return this.openRooms.includes(user.id);
  }

  sortByStringProperty(array, property) {
    array.sort((a, b) => {
      if (a[property] > b[property]) return 1;
      if (a[property] < b[property]) return -1;
      return 0;
    });
  }

  search(term: string) {
    if (term) {
      const options = {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        keys: ["username"]
      };
      this.fuse = new Fuse(this.offlineUsers.concat(this.onlineUsers), options); // "list" is the item array
      const users: User[] = this.fuse.search(term);
      const { online, offline } = this.partitionUsers(users);
      this.onlineDisplay = online;
      this.offlineDisplay = offline;
    } else {
      this.onlineDisplay = this.onlineUsers;
      this.offlineDisplay = this.offlineUsers;
    }
  }

  getLogo(user: User) {
    return `url(${user.logo ? user.logo : "assets/images/no_logo.jpg"})`;
  }
}

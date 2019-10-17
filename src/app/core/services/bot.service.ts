import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { StreamerSettings } from 'app/models/streamer-settings';
import { Request } from 'app/models/request';
import { StreamerSettingsService } from './streamer-settings.service';
import { AuthService } from './auth.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { DisplayDialogComponent } from 'app/shared/display-dialog/display-dialog.component';
import { StreamerPoll } from 'app/models/streamer-poll';
import { StreamerPollsService } from './streamer-polls.service';
import { User } from 'app/models/user';
import { StreamerSongsService } from './streamer-songs.service';
import { StreamerSong } from 'app/models/streamer-song';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  user: User;

  loading = true;
  message = '';
  streamerSettings: StreamerSettings;
  fetching = { requestQueue: false, playedRequests: false, songs: false, polls: false };

  playing = null;

  requestQueue: Request[] = [];
  menuTarget: Request;

  playedRequests: Request[] = [];

  downloadWarning = `These links could point anywhere, are provided by random people on the internet, and are in no way affiliated with JopeBot.
  
  Do You Wish To Continue?`;

  polls: StreamerPoll[] = [];

  gotSettings$: ReplaySubject<void> = new ReplaySubject<void>();

  constructor(
    private requestService: RequestService,
    private streamerSettingsService: StreamerSettingsService,
    private dialog: MatDialog,
    private streamerPollsService: StreamerPollsService,
    private userService: UserService,
    private socketService: SocketService
  ) {
    this.socketService.refreshDatasets$.subscribe(() => {
      this.refreshData();
    });
  }

  use(user: User | string) {
    if (typeof user === 'string') {
      if (!this.user || this.user.id !== Number(user)) {
        this.userService.getOneById(user).subscribe((u: User) => {
          if (u) {
            console.log('Bot Service is now using user ', u.displayName);
            this.user = u;
            this.getStreamerSettings();
          }
        });
      }
    } else if (!this.user || this.user.id !== user.id) {
      console.log('Bot Service is now using user ', user.displayName);
      this.user = user;
      this.getStreamerSettings();
    }
  }

  async getAllRequests() {
    this.loading = false;
    this.message = '';
    this.fetching.requestQueue = true;
    this.fetching.playedRequests = true;

    const allRequests = await this.requestService.getAll({ streamer_id: this.user.id }).toPromise();

    this.requestQueue = allRequests.filter(r => !r.played);
    this.playedRequests = allRequests.filter(r => r.played);

    this.sortByDateField(this.requestQueue, 'createdAt', true);
    this.sortByDateField(this.playedRequests, 'played', false);

    this.fetching.requestQueue = false;
    this.fetching.playedRequests = false;

    console.log(this.requestQueue);
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

  refreshData() {
    this.getAllRequests();
    this.getPolls();
  }

  getStreamerSettings() {
    this.message = 'Finding Streamer Settings...';
    this.streamerSettingsService
      .getAll({
        user_id: this.user.id
      })
      .subscribe((streamerSettings: StreamerSettings[]) => {
        if (streamerSettings.length) {
          this.streamerSettings = streamerSettings[0];
          this.gotSettings$.next();
          this.refreshData();
        } else {
          this.message = 'Initializing Settings For New Streamer!';
          const streamerSettings = new StreamerSettings({
            user: this.user
          });
          this.streamerSettingsService.create(streamerSettings).subscribe((ss: StreamerSettings) => {
            this.message = 'Initialized With Default Settings!';
            setTimeout(() => {
              this.message = 'Fetching Request Lists';
              this.gotSettings$.next();
              this.refreshData();
            }, 1000);
          });
        }
      });
  }

  getPolls() {
    this.fetching.polls = true;
    this.streamerPollsService.getAll({ user_id: this.user.id }).subscribe((polls: StreamerPoll[]) => {
      this.polls = polls;
      this.fetching.polls = false;
    });
  }

  getRequestMessage(request: Request) {
    if (request.message) {
      return request.message;
    }

    if (request.song) {
      const json = JSON.parse(request.song);
      if (json.Name) {
        return json.Name;
      }
      if (json.name) {
        return json.name;
      }
      if (json.songName) {
        return json.songName;
      }

      return json[Object.keys(json)[0]];
    }

    if (request.link) {
      return request.link;
    }
  }

  showSongInfo(song: string) {
    if (song) {
      const json = JSON.parse(song);
      const content = Object.keys(json)
        .map(key => `${key}: ${json[key]}`)
        .join('\n');
      this.dialog
        .open(DisplayDialogComponent, { data: { title: 'Info', content } })
        .afterClosed()
        .subscribe(result => {
          if (result) {
          }
        });
    }
  }

  deleteRequest() {
    const targetRequest: Request = this.menuTarget;
    this.requestService.delete(targetRequest.id).subscribe(() => {
      console.log('Deleted Request!');
      this.refreshData();
    });
  }

  play(request: Request) {
    this.playing = request.id;
    request.played = new Date();
    this.requestService.update(request).subscribe((updatedRequest: Request) => {
      console.log(updatedRequest);
      this.playing = null;
    });
  }

  unplay(request: Request) {
    this.playing = request.id;
    request.played = null;
    this.requestService.update(request).subscribe((updatedRequest: Request) => {
      console.log(updatedRequest);
      this.playing = null;
    });
  }

  openLink(link: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: { title: 'Caution! SpOOpy!', question: this.downloadWarning }
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          window.open(link, '_blank');
        }
      });
  }

  submitNewRequest(request: Request) {
    return request.id !== null ? this.requestService.update(request) : this.requestService.create(request);
  }
}

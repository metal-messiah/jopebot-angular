import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/services/user.service';
import { UserValidator } from 'app/core/extenders/UserValidator';
import { AuthService } from 'app/core/services/auth.service';
import { StreamerSettings } from 'app/models/streamer-settings';
import { StreamerSettingsService } from 'app/core/services/streamer-settings.service';
import { SocketService } from 'app/core/services/socket.service';
import { RequestService } from 'app/core/services/request.service';
import { Request } from 'app/models/request';
import { DisplayDialogComponent } from 'app/shared/display-dialog/display-dialog.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { StreamerPollsService } from 'app/core/services/streamer-polls.service';
import { StreamerPollResult } from 'app/models/streamer-poll-result';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.css']
})
export class BotComponent implements OnInit {
  loading = true;
  message = '';
  streamerSettings: StreamerSettings;
  fetching = { requestQueue: false, playedRequests: false };

  playing = null;

  requestQueue: Request[] = [];
  menuTarget: Request;

  playedRequests: Request[] = [];

  downloadWarning = `These links could point anywhere, are provided by random people on the internet, and are in no way affiliated with JopeBot.
  
  Do You Wish To Continue?`;

  constructor(
    private authService: AuthService,
    private streamerSettingsService: StreamerSettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private requestService: RequestService,
    private dialog: MatDialog,
    private streamerPollsService: StreamerPollsService
  ) {}

  ngOnInit() {
    this.message = 'Finding Streamer Settings...';

    this.streamerSettingsService
      .getAll({ user_id: this.authService.currentUser.id })
      .subscribe((streamerSettings: StreamerSettings[]) => {
        if (streamerSettings.length) {
          this.streamerSettings = streamerSettings[0];
          this.refreshData();
        } else {
          this.message = 'Initializing Settings For New Streamer!';
          const streamerSettings = new StreamerSettings({
            user: this.authService.currentUser
          });
          this.streamerSettingsService.create(streamerSettings).subscribe((ss: StreamerSettings) => {
            this.message = 'Initialized With Default Settings!';
            setTimeout(() => {
              this.message = 'Fetching Request Lists';
              this.refreshData();
            }, 1000);
          });
        }
      });

    // subscribe to socket refresh!
    this.socketService.refreshDatasets$.subscribe(() => {
      this.refreshData();
    });
  }

  async getAllRequests() {
    this.loading = false;
    this.message = '';
    this.fetching.requestQueue = true;
    this.fetching.playedRequests = true;

    const allRequests = await this.requestService.getAll({ streamer_id: this.authService.currentUser.id }).toPromise();

    this.requestQueue = allRequests.filter(r => !r.played);
    this.playedRequests = allRequests.filter(r => r.played);

    this.sortByDateField(this.requestQueue, 'createdAt', true);
    this.sortByDateField(this.playedRequests, 'played', false);

    this.fetching.requestQueue = false;
    this.fetching.playedRequests = false;
  }

  refreshData() {
    this.getAllRequests();
    this.getPollResults();
  }

  getPollResults() {
    this.streamerPollsService.getPollResults(1).subscribe((results: StreamerPollResult) => {
      console.log(results);
    });
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

  scrollTo(elemId: string) {
    const elem = document.getElementById(elemId);
    elem.scrollIntoView({ behavior: 'smooth' });
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
}

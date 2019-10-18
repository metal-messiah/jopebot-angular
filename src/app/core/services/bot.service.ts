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
import { UserService } from './user.service';
import { ReplaySubject } from 'rxjs';
import { SocketService } from './socket.service';
import { StreamerPollRequest } from 'app/models/streamer-poll-request';
import { StreamerPollRequest as InputPollRequest } from 'app/models/server-input/streamer-poll-request';
import { StreamerPollsRequestsService } from './streamer-polls-requests.service';
import { SelectDialogComponent } from 'app/shared/select-dialog/select-dialog.component';
import { Validators } from '@angular/forms';
import { InputDialogComponent } from 'app/shared/input-dialog/input-dialog.component';
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
    private socketService: SocketService,
    private streamerPollsRequestsService: StreamerPollsRequestsService
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

  async editPollRequests(poll: StreamerPoll, pollRequests: StreamerPollRequest[]) {
    const labels = this.requestQueue.map(request => this.getRequestMessage(request));
    const initialData = pollRequests.map(pr => pr.request);
    console.log(initialData);
    const requests: Request[] | string = await this.dialog
      .open(SelectDialogComponent, {
        data: {
          title: 'Select Requests For Poll',
          options: this.requestQueue,
          labels,
          extraButtonLabels: ['Random'],
          extraButtonActions: ['__RANDOM__'],
          initialData
        }
      })
      .afterClosed()
      .toPromise();

    if (requests) {
      if (requests === '__RANDOM__') {
        const limit = this.requestQueue.length > 10 ? 10 : this.requestQueue.length;
        const howManyRequests = await this.dialog
          .open(InputDialogComponent, {
            data: {
              title: `Select Random Requests`,
              placeholder: `Add Between 2 and ${limit} Requests to Poll`,
              initialValue: 2,
              inputType: 'number',
              validators: [Validators.required, Validators.pattern(/^\d+$/), Validators.max(limit), Validators.min(2)]
            }
          })
          .afterClosed()
          .toPromise();

        const clonedList = Object.assign([], this.requestQueue);
        const randomRequests = [];
        for (let i = 0; i < howManyRequests; i++) {
          const idx = Math.floor(Math.random() * clonedList.length);
          const r = clonedList.splice(idx, 1);
          randomRequests.push(...r);
        }

        this.editPollRequestsOnServer(poll, randomRequests);
      } else if (requests.length && typeof requests !== 'string') {
        this.editPollRequestsOnServer(poll, requests);
      }
    }
  }

  editPollRequestsOnServer(poll: StreamerPoll, requests: Request[]) {
    console.log('EDITING POLL!');
    console.log(poll);

    // Now we need to relate the requests to the poll!

    poll.requests.forEach(pollRequest => {
      if (!requests.map(r => r.id).includes(pollRequest.request.id)) {
        // the old poll requests dont match the new set of requests anymore, delete the old one
        this.streamerPollsRequestsService.delete(pollRequest.id).subscribe(pr => {
          console.log('deleted ', pr);
        });
      } else {
        const idx = requests.findIndex(r => r.id === pollRequest.request.id);
        requests.splice(idx, 1);
      }
    });
    if (requests.length) {
      requests.forEach(request => {
        const pollRequest = new InputPollRequest({ request_id: request.id, streamer_poll_id: poll.id });
        this.streamerPollsRequestsService.create(pollRequest).subscribe(pr => {
          console.log('RELATED REQUEST TO POLL!', pr);
          this.refreshData();
        });
      });
    } else {
      this.refreshData();
    }
  }

  async addPoll() {
    const labels = this.requestQueue.map(request => this.getRequestMessage(request));
    const requests: Request[] | string = await this.dialog
      .open(SelectDialogComponent, {
        data: {
          title: 'Select Requests To Add To Poll',
          options: this.requestQueue,
          labels,
          extraButtonLabels: ['Random'],
          extraButtonActions: ['__RANDOM__'],
          initialData: []
        }
      })
      .afterClosed()
      .toPromise();

    if (requests) {
      if (requests === '__RANDOM__') {
        const limit = this.requestQueue.length > 10 ? 10 : this.requestQueue.length;
        const howManyRequests = await this.dialog
          .open(InputDialogComponent, {
            data: {
              title: `Select Random Requests`,
              placeholder: `Add Between 2 and ${limit} Requests to Poll`,
              initialValue: 2,
              inputType: 'number',
              validators: [Validators.required, Validators.pattern(/^\d+$/), Validators.max(limit), Validators.min(2)]
            }
          })
          .afterClosed()
          .toPromise();

        const clonedList = Object.assign([], this.requestQueue);
        const randomRequests = [];
        for (let i = 0; i < howManyRequests; i++) {
          const idx = Math.floor(Math.random() * clonedList.length);
          const r = clonedList.splice(idx, 1);
          randomRequests.push(...r);
        }

        this.createPollAndAddRequests(randomRequests);
      } else if (requests.length && typeof requests !== 'string') {
        this.createPollAndAddRequests(requests);
      }
    }
  }

  createPollAndAddRequests(requests: Request[]) {
    this.streamerPollsService.create({ user: this.user }).subscribe((poll: StreamerPoll) => {
      console.log('MADE POLL!');
      console.log(poll);

      // Now we need to relate the requests to the new poll!

      requests.forEach(request => {
        const pollRequest = new InputPollRequest({ request_id: request.id, streamer_poll_id: poll.id });
        this.streamerPollsRequestsService.create(pollRequest).subscribe(pr => {
          console.log('RELATED REQUEST TO POLL!', pr);
          this.refreshData();
        });
      });
    });
  }

  async addRequestToPoll() {
    const request = this.menuTarget;

    const choice = await this.dialog.open(ConfirmDialogComponent, { data: { title: '' } });

    const polls = await this.dialog
      .open(SelectDialogComponent, {
        data: { title: 'Select Poll', options: this.polls, displayField: 'id' }
      })
      .afterClosed()
      .toPromise();

    // const pollRequest = new InputPollRequest({ streamer_poll_id: poll.id, request_id: request.id });
    // this.streamerPollsRequestsService.create(pollRequest).subscribe((pr: StreamerPollRequest) => {
    //   console.log(pr);
    // });
  }
}

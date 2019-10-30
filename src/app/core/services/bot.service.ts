import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { StreamerSettings } from 'app/models/streamer-settings';
import { Request } from 'app/models/request';
import { StreamerSettingsService } from './streamer-settings.service';
import { AuthService } from './auth.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DisplayDialogComponent } from 'app/shared/display-dialog/display-dialog.component';
import { StreamerPoll } from 'app/models/streamer-poll';
import { StreamerPollsService } from './streamer-polls.service';
import { User } from 'app/models/user';
import { UserService } from './user.service';
import { ReplaySubject, Observable, zip } from 'rxjs';
import { SocketService } from './socket.service';
import { StreamerPollRequest } from 'app/models/streamer-poll-request';
import { StreamerPollRequest as InputPollRequest } from 'app/models/server-input/streamer-poll-request';
import { StreamerPollsRequestsService } from './streamer-polls-requests.service';
import { SelectDialogComponent } from 'app/shared/select-dialog/select-dialog.component';
import { Validators } from '@angular/forms';
import { InputDialogComponent } from 'app/shared/input-dialog/input-dialog.component';
import { Tables } from 'app/enums/tables';
import { LikesService } from './likes.service';
import { Like } from 'app/models/like';
import { SnackbarQueueService } from './snackbar-queue.service';
import { StreamerSongsService } from './streamer-songs.service';
import { StreamerSong } from 'app/models/streamer-song';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  user: User;

  loading = true;
  message = '';
  streamerSettings: StreamerSettings;
  fetching = { requests: false, songs: false, polls: false };

  playing = null;

  requestQueue: Request[] = [];
  menuTarget: Request;

  playedRequests: Request[] = [];

  downloadWarning = `These links could point anywhere, are provided by random people on the internet, and are in no way affiliated with JopeBot.
  
  Do You Wish To Continue?`;

  polls: StreamerPoll[] = [];

  gotSettings$: ReplaySubject<void> = new ReplaySubject<void>();

  deleting = false;
  liking = null;

  userRequests: number;

  streamerSongsText: string;

  constructor(
    private requestService: RequestService,
    private streamerSettingsService: StreamerSettingsService,
    private dialog: MatDialog,
    private streamerPollsService: StreamerPollsService,
    private userService: UserService,
    private socketService: SocketService,
    private streamerPollsRequestsService: StreamerPollsRequestsService,
    private likesService: LikesService,
    private snackbar: SnackbarQueueService,
    private authService: AuthService,
    private streamerSongsService: StreamerSongsService,
    private utilitiesService: UtilitiesService
  ) {
    this.socketService.refreshDatasets$.subscribe((table: Tables) => {
      console.log('REFRESH FOR ', table);
      this.refreshData(table);
    });
  }

  use(user: User | string) {
    if (typeof user === 'string') {
      if (!this.user || this.user.id !== Number(user)) {
        this.userService.getOneById(user).subscribe((u: User) => {
          if (u) {
            console.log('Bot Service is now using user ', u.displayName);
            this.reset();
            this.user = u;
            this.getStreamerSettings();
          }
        });
      }
    } else if (!this.user || this.user.id !== user.id) {
      console.log('Bot Service is now using user ', user.displayName);
      this.reset();
      this.user = user;
      this.getStreamerSettings();
    }
  }

  private reset() {
    this.user = null;
    this.loading = true;
    this.message = '';
    this.streamerSettings = null;
    this.fetching = { requests: false, songs: false, polls: false };
    this.playing = null;
    this.requestQueue = [];
    this.menuTarget = null;
    this.playedRequests = [];
    this.downloadWarning = `These links could point anywhere, are provided by random people on the internet, and are in no way affiliated with JopeBot.
  
  Do You Wish To Continue?`;
    this.polls = [];
    this.deleting = false;
    this.liking = null;
    this.userRequests = null;
    this.streamerSongsText = null;
  }

  async getAllRequests() {
    this.loading = false;
    this.message = '';
    this.fetching.requests = true;

    const allRequests = await this.requestService.getAll({ streamer_id: this.user.id }).toPromise();

    this.requestQueue = allRequests.filter(r => !r.played);
    this.playedRequests = allRequests.filter(r => r.played);

    this.sortByDateField(this.requestQueue, 'createdAt', true);
    this.sortByDateField(this.playedRequests, 'played', false);

    this.fetching.requests = false;
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

  sortByNumberField(list: any[], property: string, asc: boolean) {
    list.sort((a, b) => {
      if (asc) {
        return Number(a[property]) - Number(b[property]);
      } else {
        return Number(b[property]) - Number(a[property]);
      }
    });
  }

  refreshData(table?: Tables) {
    switch (table) {
      case Tables.requests:
      case Tables.likes:
        this.getAllRequests();
        break;
      case Tables.streamer_polls:
      case Tables.streamer_polls_requests:
      case Tables.streamer_polls_votes:
        this.getPolls();
        break;
      case Tables.streamer_settings:
        this.getStreamerSettings();
        break;
      default:
        this.getAllRequests();
        this.getPolls();
        this.getCounts();
    }
  }

  get canRequest(): boolean {
    if (this.streamerSettings) {
      return (
        this.streamerSettings.requestsPerUser > this.userRequests &&
        this.streamerSettings.requestQueueLimit > this.requestQueue.length
      );
    }
    return false;
  }

  getCounts() {
    this.requestService
      .count({
        user_id: this.authService.currentUser.id,
        streamer_id: this.user.id,
        'played is': null
      })
      .subscribe(count => {
        this.userRequests = count;
        if (this.streamerSettings) {
          if (this.streamerSettings.requestsPerUser <= this.userRequests) {
            console.log('reached limit');
            this.snackbar.add('You have reached your request limit');
          }
          if (this.streamerSettings.requestQueueLimit <= this.requestQueue.length) {
            console.log('full');
            this.snackbar.add('The request list is full');
          }
        }
      });
  }

  getExistingSongs() {
    console.log('get existing songs');
    this.streamerSongsService
      .getAll({
        user_id: this.user.id
      })
      .subscribe((streamerSongs: StreamerSong[]) => {
        if (streamerSongs.length) {
          this.streamerSongsText = `Last Updated At ${streamerSongs[0].updatedAt.toLocaleString()}`;
          this.loading = false;
        } else {
          this.streamerSongsText = `No File Found`;
        }
      });
  }

  getStreamerSettings() {
    this.message = 'Finding Streamer Settings...';
    setTimeout(() => {
      this.streamerSettingsService
        .getAll({
          user_id: this.user.id
        })
        .subscribe((streamerSettings: StreamerSettings[]) => {
          if (streamerSettings.length) {
            console.log('got streamer settings');
            this.streamerSettings = streamerSettings[0];
            this.gotSettings$.next();
            this.refreshData();
            this.getExistingSongs();
          } else {
            console.log('initializing settings for new streamer');
            this.message = 'Initializing Settings For New Streamer!';
            const streamerSettings = new StreamerSettings({
              user: this.user
            });
            this.streamerSettingsService.create(streamerSettings).subscribe((ss: StreamerSettings) => {
              console.log('initia;ized with default settings');
              this.message = 'Initialized With Default Settings!';
              setTimeout(() => {
                this.message = 'Fetching Request Lists';
                this.gotSettings$.next();
                this.refreshData();
                this.getExistingSongs();
              }, 1000);
            });
          }
        });
    }, 1000);
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

  deleteAllRequests(dataset: Request[]) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Caution!!',
          question: `This will delete all (${dataset.length.toLocaleString()}) request${
            this.requestQueue.length === 1 ? '' : 's'
          }!`
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const queue = dataset.map(r => this.requestService.delete(r.id));
          zip(...queue).subscribe(d => {
            this.snackbar.add(`Permanently Deleted ${d.length.toLocaleString()} Requests`, null, { duration: 3000 });
          });
        }
      });
  }

  deleteRequest() {
    const targetRequest: Request = this.menuTarget;
    this.requestService.delete(targetRequest.id).subscribe(() => {
      console.log('Deleted Request!');
      this.refreshData(Tables.requests);
      this.snackbar.add(`Permanently Deleted ${this.getRequestMessage(targetRequest)}`, null, { duration: 3000 });
    });
  }

  toggleLike(request: Request, user: User) {
    this.liking = request.id;
    const match = request.likes.filter(l => l.user.id === user.id);
    if (match.length) {
      // exists, so to toggle, delete it
      this.likesService.delete(match[0].id).subscribe(() => {
        this.liking = null;
      });
    } else {
      // add one
      console.log(user);
      const like = new Like({ request, user });
      this.likesService.create(like).subscribe(like => {
        this.liking = null;
      });
    }
  }

  playRandom() {
    const request = this.requestQueue[Math.floor(Math.random() * this.requestQueue.length)];
    this.playing = request.id;
    request.played = new Date();
    this.requestService.update(request).subscribe((updatedRequest: Request) => {
      console.log(updatedRequest);
      this.playing = null;
      this.snackbar.add(`Now Playing Random Request - ${this.getRequestMessage(request)}`, null, { duration: 3000 });
    });
  }

  play(request: Request) {
    this.playing = request.id;
    request.played = new Date();
    this.requestService.update(request).subscribe((updatedRequest: Request) => {
      console.log(updatedRequest);
      this.playing = null;
      this.snackbar.add(`Now Playing ${this.getRequestMessage(request)}`, null, { duration: 3000 });
    });
  }

  unplay(request: Request) {
    this.playing = request.id;
    request.played = null;
    this.requestService.update(request).subscribe((updatedRequest: Request) => {
      console.log(updatedRequest);
      this.playing = null;
      this.snackbar.add(`Moved ${this.getRequestMessage(request)} Back to Request Queue`, null, { duration: 3000 });
    });
  }

  openLink(link: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: { title: 'Caution! SpOOpy!', question: `${link}\n\n${this.downloadWarning}` }
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          window.open(link, '_blank');
        }
      });
  }

  submitNewRequest(request: Request) {
    console.log(request.id);
    return request.id !== null && request.id !== undefined
      ? this.requestService.update(request)
      : this.requestService.create(request);
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
          disclaimer: 'Removing a request will clear its votes!',
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
    const changes = [];
    poll.requests.forEach(pollRequest => {
      if (!requests.map(r => r.id).includes(pollRequest.request.id)) {
        // the old poll requests dont match the new set of requests anymore, delete the old one
        changes.push(this.streamerPollsRequestsService.delete(pollRequest.id));
      } else {
        const idx = requests.findIndex(r => r.id === pollRequest.request.id);
        requests.splice(idx, 1);
      }
    });

    requests.forEach(request => {
      const pollRequest = new InputPollRequest({ request_id: request.id, streamer_poll_id: poll.id });
      changes.push(this.streamerPollsRequestsService.create(pollRequest));
    });

    zip(...changes).subscribe(d => {
      this.refreshData(Tables.streamer_polls);

      this.snackbar.add(`Updated Poll`, null, { duration: 3000 });
    });
  }

  deletePoll(poll: StreamerPoll) {
    this.deleting = true;
    this.streamerPollsService.delete(poll.id).subscribe(poll => {
      this.deleting = false;

      this.snackbar.add(`Deleted Poll`, null, { duration: 3000 });
    });
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
      // Now we need to relate the requests to the new poll!
      const changes = [];
      requests.forEach(request => {
        const pollRequest = new InputPollRequest({ request_id: request.id, streamer_poll_id: poll.id });
        changes.push(this.streamerPollsRequestsService.create(pollRequest));
      });
      zip(...changes).subscribe(d => {
        this.refreshData(Tables.streamer_polls);

        this.snackbar.add(`Created Poll`, null, { duration: 3000 });
      });
    });
  }

  async requestHelp() {
    const message = await this.dialog
      .open(InputDialogComponent, {
        data: {
          title: `Allow A Staff Member To Control Your Bot - (Check Your Twitch Chat Too)`,
          placeholder: `Help Message`,
          initialValue: '',
          inputType: 'text',
          validators: [Validators.required]
        }
      })
      .afterClosed()
      .toPromise();

    if (message) {
      this.utilitiesService.requestHelp(message).subscribe(() => {
        console.log('submitted help request');
      });
    }
  }
}

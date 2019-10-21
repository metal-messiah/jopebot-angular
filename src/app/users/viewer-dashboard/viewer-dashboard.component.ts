import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { User } from '../../models/user';
import { UserService } from 'app/core/services/user.service';
import { StreamerSongsService } from 'app/core/services/streamer-songs.service';
import { StreamerUserPrivilegesService } from 'app/core/services/streamer-user-privileges.service';
import { StreamerSettingsService } from 'app/core/services/streamer-settings.service';
import { RequestService } from 'app/core/services/request.service';
import { Request } from '../../models/request';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import eh from '../../interfaces/error-handler';

import { trigger, transition, useAnimation } from '@angular/animations';
import { zoomIn } from 'ng-animate';
import { StreamerSong } from 'app/models/streamer-song';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { DisplayDialogComponent } from 'app/shared/display-dialog/display-dialog.component';
import { SocketService } from 'app/core/services/socket.service';
import { StreamerSettings } from 'app/models/streamer-settings';
import { BotService } from 'app/core/services/bot.service';
import { RequestCardType } from '../../enums/request-card-type';

@Component({
  selector: 'app-viewer-dashboard',
  templateUrl: './viewer-dashboard.component.html',
  styleUrls: ['./viewer-dashboard.component.css'],
  animations: [trigger('zoomIn', [transition('* => *', useAnimation(zoomIn))])]
})
export class ViewerDashboardComponent implements OnInit {
  requestCardTypes = RequestCardType;

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

  streamerSettings: StreamerSettings = null;
  userRequests = 0;

  snacks = [];
  private snackConfig: MatSnackBarConfig = {
    duration: 2000
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private authService: AuthService,
    private userService: UserService,
    private requestService: RequestService,
    private streamerSongsService: StreamerSongsService,
    private dialog: MatDialog,
    private socketService: SocketService,
    private streamerSettingsService: StreamerSettingsService,
    private botService: BotService,
    private snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    // Subscribed
    this.route.paramMap.subscribe(async params => {
      this.streamerIdParam = params.get('userid');
      await this.getUserFromId(this.streamerIdParam);
      if (this.userFromId) {
        this.botService.use(this.userFromId);
        this.refreshData();
      }
    });
  }

  refreshData() {
    this.getCounts();
  }

  getCounts() {
    this.requestService
      .count({
        user_id: this.authService.currentUser.id,
        streamer_id: this.streamerIdParam,
        'played is': null
      })
      .subscribe(count => {
        this.userRequests = count;
        if (!this.botService.canRequest(this.userRequests)) {
          console.log('cant request');
          if (this.botService.streamerSettings.requestsPerUser <= this.userRequests) {
            console.log('reached limit');
            this.snacks.push('You have reached your request limit');
          }
          if (this.botService.streamerSettings.requestQueueLimit <= this.botService.requestQueue.length) {
            console.log('full');
            this.snacks.push('The request list is full');
          }
          this.handleSnackbar();
        }
      });
  }

  handleSnackbar() {
    const msg = this.snacks.length ? this.snacks.shift() : null;
    if (msg) {
      this.snackbar
        .open(msg, null, this.snackConfig)
        .afterDismissed()
        .subscribe(() => {
          this.handleSnackbar();
        });
    }
  }

  async getUserFromId(id: string | number) {
    const [error, user] = await eh(this.userService.getOneById(this.streamerIdParam).toPromise());
    if (error) {
      this.setErrorMsg(`${this.streamerIdParam} does not reference a valid user...`);
    } else {
      this.userFromId = user;
    }
  }

  setErrorMsg(msg: string) {
    this.errorMsg = msg;
  }

  shouldDisableMenu(request: Request) {
    return request.createdBy.id !== this.authService.currentUser.id;
  }

  scrollTo(elemId: string) {
    const elem = document.getElementById(elemId);
    elem.scrollIntoView({ behavior: 'smooth' });
  }

  newRequest() {
    this.router.navigate(['request'], { relativeTo: this.route });
  }

  setMenuTarget(request: Request) {
    this.botService.menuTarget = request;
  }
}

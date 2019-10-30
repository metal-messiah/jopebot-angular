import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { RequestService } from './request.service';
import io from 'socket.io-client';
import { BotComponent } from 'app/my-bot/bot/bot.component';
import { AuthService } from './auth.service';
import { ViewerDashboardComponent } from 'app/users/viewer-dashboard/viewer-dashboard.component';
import { SocketService } from './socket.service';
import { User } from 'app/models/user';
import { StreamerSettingsComponent } from 'app/my-bot/streamer-settings/streamer-settings.component';
import { StreamerSongsComponent } from 'app/my-bot/streamer-songs/streamer-songs.component';

@Injectable()
export class SocketGuard implements CanActivate {
  next: ActivatedRouteSnapshot;

  constructor(private socketService: SocketService, private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.next = next;
    this.socketService.disconnect();

    if (this.authService.currentUser) {
      this.handleRoomBasedOnComponent(next.component['name'], this.authService.currentUser.id);
      return true;
    } else {
      const promise: Promise<boolean> = new Promise((resolve, reject) => {
        this.authService.fetchCurrentUserFromDB().subscribe((user: User) => {
          console.log(user);
          if (user) {
            this.handleRoomBasedOnComponent(next.component['name'], user.id);

            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
      return promise;
    }
  }

  handleRoomBasedOnComponent(componentName, userId) {
    switch (componentName) {
      case BotComponent.name:
      case StreamerSettingsComponent.name:
      case StreamerSongsComponent.name:
        if (this.next.params.userid) {
          this.createAndJoinRoom(this.next.params.userid);
        } else {
          this.createAndJoinRoom(userId);
        }
        break;
      case ViewerDashboardComponent.name:
        this.createAndJoinRoom(this.next.params.userid);
        break;
    }
  }

  createAndJoinRoom(userId) {
    this.socketService.createRoom(userId).subscribe(() => {
      this.socketService.connect(userId);
    });
  }
}

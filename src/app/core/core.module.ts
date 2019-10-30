import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './services/auth.service';
import { RoutingStateService } from './services/routing-state.service';
import { UpdateService } from './services/update.service';
import { AuthGuard } from './services/auth.guard';
import { RestService } from './services/rest.service';
import { CanDeactivateGuard } from './services/can-deactivate.guard';
import { UserService } from './services/user.service';
import { RequestService } from './services/request.service';
import { StreamerSettingsService } from './services/streamer-settings.service';
import { StreamerSongsService } from './services/streamer-songs.service';
import { StreamerUserPrivilegesService } from './services/streamer-user-privileges.service';
import { UserGuard } from './services/user.guard';
import { OwnedGuard } from './services/owned.guard';
import { SocketGuard } from './services/socket.guard';
import { SocketService } from './services/socket.service';
import { StorageService } from './services/storage.service';
import { StreamerPollsService } from './services/streamer-polls.service';
import { StreamerPollsRequestsService } from './services/streamer-polls-requests.service';
import { StreamerPollsVotesService } from './services/streamer-polls-votes.service';
import { LikesService } from './services/likes.service';
import { SnackbarQueueService } from './services/snackbar-queue.service';
import { ChatService } from './services/chat.service';
import { RoleGuard } from './services/role.guard';
import { UtilitiesService } from './services/utilities.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  providers: [
    AuthService,
    RoutingStateService,
    UpdateService,
    AuthGuard,
    UserGuard,
    OwnedGuard,
    SocketGuard,
    RoleGuard,
    SocketService,
    StorageService,
    UtilitiesService,
    RestService,
    UserService,
    RequestService,
    StreamerSettingsService,
    StreamerSongsService,
    StreamerUserPrivilegesService,
    StreamerPollsService,
    StreamerPollsRequestsService,
    StreamerPollsVotesService,
    LikesService,
    SnackbarQueueService,
    ChatService,
    CanDeactivateGuard
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}

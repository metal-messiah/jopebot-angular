import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/services/auth.guard';
import { MyBotComponent } from './my-bot.component';
import { StreamerSettingsComponent } from './streamer-settings/streamer-settings.component';
import { StreamerSongsComponent } from './streamer-songs/streamer-songs.component';
import { BotComponent } from './bot/bot.component';
import { SocketGuard } from 'app/core/services/socket.guard';
import { RoleGuard } from 'app/core/services/role.guard';

const routes: Routes = [
  {
    path: 'bot',
    component: MyBotComponent,
    canActivate: [AuthGuard, SocketGuard],
    children: [
      {
        path: '',
        component: BotComponent,
        canActivate: [AuthGuard, SocketGuard]
      },
      {
        path: 'settings',
        component: StreamerSettingsComponent,
        canActivate: [AuthGuard, SocketGuard]
      },
      {
        path: 'files',
        component: StreamerSongsComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'bot/:userid',
    component: MyBotComponent,
    canActivate: [AuthGuard, RoleGuard, SocketGuard],
    children: [
      {
        path: '',
        component: BotComponent,
        canActivate: [AuthGuard, SocketGuard]
      },
      {
        path: 'settings',
        component: StreamerSettingsComponent,
        canActivate: [AuthGuard, SocketGuard]
      },
      {
        path: 'files',
        component: StreamerSongsComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyBotRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyBotComponent } from './my-bot.component';
import { MyBotRoutingModule } from './my-bot-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { BotComponent } from './bot/bot.component';
import { StreamerSongsComponent } from './streamer-songs/streamer-songs.component';
import { StreamerSettingsComponent } from './streamer-settings/streamer-settings.component';
import { PrivilegesComponent } from './privileges/privileges.component';

@NgModule({
  declarations: [MyBotComponent, BotComponent, StreamerSettingsComponent, StreamerSongsComponent, PrivilegesComponent],
  imports: [CommonModule, MyBotRoutingModule, SharedModule]
})
export class MyBotModule {}

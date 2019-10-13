import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyBotComponent } from './my-bot.component';
import { MyBotRoutingModule } from './my-bot-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { BotComponent } from './bot/bot.component';
import { StreamerSongsComponent } from './streamer-songs/streamer-songs.component';
import { StreamerSettingsComponent } from './streamer-settings/streamer-settings.component';
import { StreamerPollsComponent } from './streamer-polls/streamer-polls.component';

@NgModule({
  declarations: [
    MyBotComponent,
    BotComponent,
    StreamerSettingsComponent,
    StreamerSongsComponent,
    StreamerPollsComponent
  ],
  imports: [CommonModule, MyBotRoutingModule, SharedModule]
})
export class MyBotModule {}

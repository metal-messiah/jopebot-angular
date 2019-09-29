import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../core/services/auth.guard";
import { MyBotComponent } from "./my-bot.component";
import { StreamerSettingsComponent } from "./streamer-settings/streamer-settings.component";
import { StreamerSongsComponent } from "./streamer-songs/streamer-songs.component";
import { BotComponent } from "./bot/bot.component";

const routes: Routes = [
  {
    path: "bot",
    component: MyBotComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: BotComponent
      },
      {
        path: "settings",
        component: StreamerSettingsComponent
      },
      {
        path: "songs",
        component: StreamerSongsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyBotRoutingModule {}

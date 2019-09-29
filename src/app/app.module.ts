import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ServiceWorkerModule } from "@angular/service-worker";

import { environment } from "../environments/environment";

import {
  FontAwesomeModule,
  FaIconLibrary
} from "@fortawesome/angular-fontawesome";
import {
  faUser,
  faSpinner,
  faCaretSquareDown,
  faLink,
  faPaperclip
} from "@fortawesome/free-solid-svg-icons";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";

import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./home/home.component";
import { UsersModule } from "./users/users.module";
import { MyBotModule } from "./my-bot/my-bot.module";

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    UsersModule,
    MyBotModule,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production
    }),
    SharedModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faTwitch, faSpinner, faUser, faCaretSquareDown);
  }
}

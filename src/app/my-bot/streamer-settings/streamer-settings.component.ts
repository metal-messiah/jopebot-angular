import { Component, OnInit } from "@angular/core";
import { StreamerSettingsService } from "app/core/services/streamer-settings.service";
import { AuthService } from "app/core/services/auth.service";
import { StreamerSettings } from "app/models/streamer-settings";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-streamer-settings",
  templateUrl: "./streamer-settings.component.html",
  styleUrls: ["./streamer-settings.component.css"]
})
export class StreamerSettingsComponent implements OnInit {
  saving = false;
  settings: StreamerSettings;

  form: FormGroup;

  constructor(
    private authService: AuthService,
    private streamerSettingsService: StreamerSettingsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshStreamerSettings();
  }

  refreshStreamerSettings() {
    const currentUserId = this.authService.currentUser.id;
    this.streamerSettingsService
      .getAll({ user_id: currentUserId })
      .subscribe((settings: StreamerSettings[]) => {
        this.settings = settings.length ? settings[0] : null;
        console.log(this.settings);
        this.form = new FormGroup({
          id: new FormControl({
            value: this.settings.id,
            disabled: true
          }),
          allowChatRequests: new FormControl({
            value: this.settings.allowChatRequests,
            disabled: true
          }),
          botVoiceName: new FormControl({
            value: this.settings.botVoiceName,
            disabled: true
          }),
          botVoiceOnRequest: new FormControl({
            value: this.settings.botVoiceOnRequest,
            disabled: true
          }),
          botVoicePitch: new FormControl({
            value: this.settings.botVoicePitch,
            disabled: true
          }),
          botVoiceRate: new FormControl({
            value: this.settings.botVoiceRate,
            disabled: true
          }),
          botVoiceVolume: new FormControl({
            value: this.settings.botVoiceVolume,
            disabled: true
          }),
          customInfoMessage: new FormControl({
            value: this.settings.customInfoMessage,
            disabled: true
          }),
          hideChatMessages: new FormControl({
            value: this.settings.hideChatMessages,
            disabled: true
          }),
          infoMessageChats: new FormControl({
            value: this.settings.infoMessageChats,
            disabled: true
          }),
          infoMessageSeconds: new FormControl({
            value: this.settings.infoMessageSeconds,
            disabled: true
          }),
          profanityFilter: new FormControl({
            value: this.settings.profanityFilter,
            disabled: true
          }),
          requestAlias: new FormControl({
            value: this.settings.requestAlias,
            disabled: true
          }),
          requestsPerUser: new FormControl(
            {
              value: this.settings.requestsPerUser,
              disabled: false
            },
            [
              Validators.required,
              Validators.min(1),
              Validators.pattern(/^-?[0-9][^\.]*$/)
            ]
          )
        });
      });
  }

  onSubmit() {
    if (this.form.valid) {
      this.saving = true;
      const newSettings = Object.assign(this.settings, this.form.value);

      this.streamerSettingsService.update(newSettings).subscribe(
        (updated: StreamerSettings) => {
          this.saving = false;
          this.router.navigate(["/bot"]);
        },
        err => {
          console.log(err);
          this.saving = false;
        }
      );
    }
  }
}

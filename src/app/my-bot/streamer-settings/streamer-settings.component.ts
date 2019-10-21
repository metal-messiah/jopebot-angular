import { Component, OnInit } from '@angular/core';
import { StreamerSettingsService } from 'app/core/services/streamer-settings.service';
import { AuthService } from 'app/core/services/auth.service';
import { StreamerSettings } from 'app/models/streamer-settings';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BotService } from 'app/core/services/bot.service';

@Component({
  selector: 'app-streamer-settings',
  templateUrl: './streamer-settings.component.html',
  styleUrls: ['./streamer-settings.component.css']
})
export class StreamerSettingsComponent implements OnInit {
  saving = false;
  settings: StreamerSettings;

  form: FormGroup;

  constructor(
    private authService: AuthService,
    private streamerSettingsService: StreamerSettingsService,
    private router: Router,
    private botService: BotService
  ) {}

  ngOnInit() {
    this.botService.use(this.authService.currentUser);

    this.botService.gotSettings$.subscribe(() => {
      this.setForm();
    });
  }

  setForm() {
    this.form = new FormGroup({
      id: new FormControl({
        value: this.botService.streamerSettings.id,
        disabled: true
      }),
      allowChatRequests: new FormControl({
        value: this.botService.streamerSettings.allowChatRequests,
        disabled: true
      }),
      requestAlias: new FormControl({
        value: this.botService.streamerSettings.requestAlias,
        disabled: true
      }),
      requestsPerUser: new FormControl(
        {
          value: this.botService.streamerSettings.requestsPerUser,
          disabled: false
        },
        [Validators.required, Validators.min(1), Validators.pattern(/^-?[0-9][^\.]*$/)]
      ),
      requestQueueLimit: new FormControl(
        {
          value: this.botService.streamerSettings.requestQueueLimit,
          disabled: false
        },
        [Validators.required, Validators.min(1), Validators.pattern(/^-?[0-9][^\.]*$/)]
      ),
      isPaused: new FormControl({
        value: this.botService.streamerSettings.isPaused,
        disabled: false
      })
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.saving = true;
      const newSettings = Object.assign(this.botService.streamerSettings, this.form.value);

      this.streamerSettingsService.update(newSettings).subscribe(
        (updated: StreamerSettings) => {
          this.saving = false;
          this.router.navigate(['/bot']);
        },
        err => {
          console.log(err);
          this.saving = false;
        }
      );
    }
  }
}

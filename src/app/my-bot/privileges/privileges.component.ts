import { Component, OnInit } from '@angular/core';
import { BotService } from 'app/core/services/bot.service';
import { FormGroup, FormControl } from '@angular/forms';
import { StreamerUserPrivilege } from 'app/models/streamer-user-privilege';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.css']
})
export class PrivilegesComponent implements OnInit {
  privs: FormGroup[] = [];
  prevSave: string;
  constructor(private botService: BotService) {}

  ngOnInit() {
    this.botService.gotPrivs$.subscribe(() => {
      console.log('got privs');
      this.privs = this.botService.privileges.map((priv: StreamerUserPrivilege) => {
        const fg = new FormGroup({
          id: new FormControl({
            value: priv.id,
            disabled: false
          }),
          isAdmin: new FormControl({
            value: priv.isAdmin,
            disabled: priv.isBlacklisted
          }),
          isBlacklisted: new FormControl({
            value: priv.isBlacklisted,
            disabled: false
          })
        });
        fg.get('isBlacklisted').valueChanges.subscribe((isBlacklisted: boolean) => {
          isBlacklisted ? fg.get('isAdmin').disable() : fg.get('isAdmin').enable();
        });

        fg.valueChanges.subscribe(values => {
          if (JSON.stringify(values) !== this.prevSave) {
            this.prevSave = JSON.stringify(values);
            this.botService.updateStreamerUserPrivileges(new StreamerUserPrivilege(values));
          }
        });
        return fg;
      });
    });
  }

  convertFormGroupToPriv(fg: FormGroup): StreamerUserPrivilege {
    return new StreamerUserPrivilege(fg.value);
  }
}

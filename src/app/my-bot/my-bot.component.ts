import { Component, OnInit } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInUp } from 'ng-animate';
import { Router, ActivatedRoute } from '@angular/router';
import { BotService } from 'app/core/services/bot.service';
import { AuthService } from 'app/core/services/auth.service';
import { UserRole } from 'app/enums/user-role';
import { StreamerUserPrivilegesService } from 'app/core/services/streamer-user-privileges.service';
import { resolve } from 'q';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-bot',
  templateUrl: './my-bot.component.html',
  styleUrls: ['./my-bot.component.css'],
  animations: [trigger('slideInUp', [transition('* => *', useAnimation(slideInUp))])]
})
export class MyBotComponent implements OnInit {
  streamerIdParam;
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private botService: BotService,
    private authService: AuthService,
    private streamerUserPrivilegesService: StreamerUserPrivilegesService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.streamerIdParam = params.get('userid');
      const hasAccess = await this.botService.hasAccess(this.streamerIdParam);
      if (hasAccess) {
        console.log('activate bot service from my-bot component');
        if (this.streamerIdParam) {
          this.botService.use(this.streamerIdParam);
        } else {
          this.botService.use(this.authService.currentUser);
        }
      } else {
        console.log('not authorized');
        this.router.navigate(['not-authorized']);
      }
    });
  }

  navigate(path: string) {
    let url = '';
    if (this.streamerIdParam) {
      url = `./${this.streamerIdParam}/${path}`;
    } else {
      url = `./${path}`;
    }
    console.log(url);
    this.router.navigate([url]), { relativeTo: this.route };
  }

  toggleToUser() {
    this.router.navigate(['users', this.botService.user.id]);
  }
}

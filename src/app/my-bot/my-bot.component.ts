import { Component, OnInit } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInUp } from 'ng-animate';
import { Router, ActivatedRoute } from '@angular/router';
import { BotService } from 'app/core/services/bot.service';
import { AuthService } from 'app/core/services/auth.service';
import { UserRole } from 'app/enums/user-role';

@Component({
  selector: 'app-my-bot',
  templateUrl: './my-bot.component.html',
  styleUrls: ['./my-bot.component.css'],
  animations: [trigger('slideInUp', [transition('* => *', useAnimation(slideInUp))])]
})
export class MyBotComponent implements OnInit {
  streamerIdParam;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private botService: BotService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      if (this.hasBetaAccess()) {
        console.log('activate bot service from my-bot component');
        this.streamerIdParam = params.get('userid');
        if (this.streamerIdParam) {
          this.botService.use(this.streamerIdParam);
        } else {
          this.botService.use(this.authService.currentUser);
        }
      } else {
        this.router.navigate(['not-authorized']);
      }
    });
  }

  hasBetaAccess() {
    return (
      this.authService.currentUser.role === UserRole.STAFF ||
      this.authService.currentUser.role === UserRole.DONOR ||
      this.authService.currentUser.role === UserRole.ADMIN
    );
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
}

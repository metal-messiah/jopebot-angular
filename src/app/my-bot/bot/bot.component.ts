import { Component, OnInit } from '@angular/core';
import { StreamerSettings } from 'app/models/streamer-settings';
import { SocketService } from 'app/core/services/socket.service';
import { Request } from 'app/models/request';
import { BotService } from 'app/core/services/bot.service';
import { RequestCardType } from '../../enums/request-card-type';
import { AuthService } from 'app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/services/user.service';
import { User } from 'app/models/user';
import eh from '../../interfaces/error-handler';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {
  requestCardTypes = RequestCardType;

  userFromId: User;
  streamerIdParam: string;

  constructor(private botService: BotService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    console.log('BOT COMPONENT!');
  }

  scrollTo(elemId: string) {
    const elem = document.getElementById(elemId);
    elem.scrollIntoView({ behavior: 'smooth' });
  }
}

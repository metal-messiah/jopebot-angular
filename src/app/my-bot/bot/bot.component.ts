import { Component, OnInit } from '@angular/core';
import { StreamerSettings } from 'app/models/streamer-settings';
import { SocketService } from 'app/core/services/socket.service';
import { Request } from 'app/models/request';
import { BotService } from 'app/core/services/bot.service';
import { RequestCardType } from '../../enums/request-card-type';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.css']
})
export class BotComponent implements OnInit {
  requestCardTypes = RequestCardType;

  constructor(private socketService: SocketService, private botService: BotService, private authService: AuthService) {}

  ngOnInit() {
    this.botService.use(this.authService.currentUser);
  }

  refreshData() {
    this.botService.getAllRequests();
  }

  scrollTo(elemId: string) {
    const elem = document.getElementById(elemId);
    elem.scrollIntoView({ behavior: 'smooth' });
  }
}

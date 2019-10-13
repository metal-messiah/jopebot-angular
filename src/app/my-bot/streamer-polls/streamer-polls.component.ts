import { Component, OnInit } from '@angular/core';
import { StreamerPollsService } from 'app/core/services/streamer-polls.service';
import { StreamerPollResult } from 'app/models/streamer-poll-result';
import { AuthService } from 'app/core/services/auth.service';
import { StreamerPoll } from 'app/models/streamer-poll';
import { StreamerPollsRequestsService } from 'app/core/services/streamer-polls-requests.service';
import { StreamerPollsVotesService } from 'app/core/services/streamer-polls-votes.service';
import { StreamerPollRequest } from 'app/models/streamer-poll-request';

@Component({
  selector: 'app-streamer-polls',
  templateUrl: './streamer-polls.component.html',
  styleUrls: ['./streamer-polls.component.css']
})
export class StreamerPollsComponent implements OnInit {
  constructor(
    private streamerPollsService: StreamerPollsService,
    private streamerPollsRequestService: StreamerPollsRequestsService,
    private streamerPollsVotesService: StreamerPollsVotesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.getPollResults();
  }

  getPollResults() {
    this.streamerPollsService
      .getAll({ user_id: this.authService.currentUser.id })
      .subscribe((polls: StreamerPoll[]) => {
        console.log('polls', polls);
      });
  }
}

import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { StreamerPoll } from 'app/models/streamer-poll';
import { ParentComponent } from 'app/enums/parent-component';
import { AuthService } from 'app/core/services/auth.service';
import { BotService } from 'app/core/services/bot.service';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import { StreamerPollRequest } from 'app/models/streamer-poll-request';
import { TinyColor, random as randomColor } from '@ctrl/tinycolor';
import { Route, ActivatedRoute } from '@angular/router';
import { StreamerPollsVotesService } from 'app/core/services/streamer-polls-votes.service';
import { StreamerPollVote } from 'app/models/streamer-poll-vote';

class ChartConfig {
  constructor(
    public labels: Label[],
    public data: SingleDataSet,
    public type: ChartType,
    public legend: boolean,
    public plugins: any[],
    public options: ChartOptions,
    public colors: { backgroundColor: any[] }[]
  ) {}
}

@Component({
  selector: 'app-poll-card',
  templateUrl: './poll-card.component.html',
  styleUrls: ['./poll-card.component.css']
})
export class PollCardComponent implements OnInit, OnChanges {
  @Input() polls: StreamerPoll[];
  view: ParentComponent;
  colors = this.getRandomHexColors(10);

  public charts = {};
  constructor(
    private botService: BotService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private streamerPollsVotesService: StreamerPollsVotesService
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.view = this.route.component['name'];
    this.buildCharts();
  }

  ngOnChanges(changes) {
    this.polls = changes.polls.currentValue.filter(poll => {
      if (this.view === ParentComponent.ViewerDashboardComponent) {
        return poll.requests.length > 0;
      }
      return 1 === 1;
    });
    this.polls.forEach(poll => {
      poll.requests.sort((a, b) => b.votes.length - a.votes.length);
    });
    this.buildCharts();
  }

  buildCharts() {
    this.polls.forEach(poll => {
      const chartConfig = new ChartConfig(
        this.getChartColumnNames(poll) || [],
        this.getChartData(poll) || [],
        'pie',
        false,
        [],
        {
          responsive: true
        },
        this.getChartColors(poll)
      );
      this.charts[poll.id] = chartConfig;
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  getChartForDom(pollId) {
    return this.charts[pollId];
  }

  getChartColors(poll: StreamerPoll) {
    // this.shuffleArray(this.colors);
    return [
      {
        backgroundColor: this.colors.slice(0, poll.requests.length)
      }
    ];
  }

  getToggleMessage(poll: StreamerPoll): string {
    return poll.isOpen ? 'Close Poll' : 'Open Poll';
  }

  getChartData(poll: StreamerPoll): SingleDataSet {
    return poll.requests.map(r => r.votes.length);
  }

  getChartColumnNames(poll: StreamerPoll): Label[] {
    return poll.requests.map(r => ` ${this.botService.getRequestMessage(r.request)}`);
  }

  getRandomHexColors(amount) {
    return Array.from({ length: amount }).map(() => {
      return this.getRandomHex();
    });
  }

  getRandomHex() {
    const r = randomColor();
    return r.isLight && r.getLuminance() > 0.4 ? `#${r.toHex()}` : this.getRandomHex();
  }

  getRowColor(index: number) {
    return this.colors[index];
  }

  userHasVoted(poll: StreamerPoll) {
    return (
      poll.requests.filter(pollRequest => {
        return pollRequest.votes.filter(vote => vote.user.id === this.authService.currentUser.id).length > 0;
      }).length > 0
    );
  }

  userHasVotedOnThisRequest(pollRequest: StreamerPollRequest) {
    return pollRequest.votes.filter(vote => vote.user.id === this.authService.currentUser.id).length > 0;
  }

  vote(pollRequest: StreamerPollRequest) {
    if (!this.userHasVotedOnThisRequest(pollRequest)) {
      const vote = new StreamerPollVote({
        user: this.authService.currentUser,
        streamer_poll_request_id: pollRequest.id
      });
      this.streamerPollsVotesService.create(vote).subscribe(vote => {
        console.log(vote);
      });
    }
  }

  getLatestPollUpdate(poll: StreamerPoll) {
    let latest = poll.updatedAt;
    poll.requests.forEach(request => {
      if (new Date(latest) < new Date(request.updatedAt)) {
        latest = request.updatedAt;
      }
      request.votes.forEach(vote => {
        if (new Date(latest) < new Date(vote.updatedAt)) {
          latest = vote.updatedAt;
        }
      });
    });
    return latest;
  }

  canClosePoll() {
    return this.view === ParentComponent.BotComponent;
  }

  shouldShowChart(poll: StreamerPoll) {
    return this.charts[poll.id].data.reduce((prev, next) => prev + next) > 0;
  }
}

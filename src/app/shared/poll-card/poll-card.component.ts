import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { StreamerPoll } from 'app/models/streamer-poll';
import { ParentComponent } from 'app/enums/parent-component';
import { AuthService } from 'app/core/services/auth.service';
import { BotService } from 'app/core/services/bot.service';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import { StreamerPollRequest } from 'app/models/streamer-poll-request';
import { StreamerPollRequest as InputPollRequest } from 'app/models/server-input/streamer-poll-request';
import { TinyColor, random as randomColor } from '@ctrl/tinycolor';
import { Route, ActivatedRoute } from '@angular/router';
import { StreamerPollsVotesService } from 'app/core/services/streamer-polls-votes.service';
import { StreamerPollVote } from 'app/models/streamer-poll-vote';
import { StreamerPollVote as InputPollVote } from 'app/models/server-input/streamer-poll-vote';
import { StreamerPollsService } from 'app/core/services/streamer-polls.service';

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

  ////////// orange, soft yellow, warn red, lavender, soft pink, green
  colors = ['#ffab40', '#fdfd96', '#ff5722', '#b47bb6', '#ffc0cb ', '#026440', '#00468b'];

  voting = false;
  toggling = false;

  hiddenGraphs = [];

  public charts = {};
  constructor(
    private botService: BotService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private streamerPollsVotesService: StreamerPollsVotesService,
    private streamerPollsService: StreamerPollsService
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.view = this.route.component['name'];
    this.colors.push(...this.getRandomHexColors(10));
    this.buildCharts();
  }

  ngOnChanges(changes) {
    this.polls = changes.polls.currentValue.filter(poll => {
      if (this.view === ParentComponent.ViewerDashboardComponent) {
        return poll.requests.length > 0;
      }
      return 1 === 1;
    });
    this.polls.sort((a, b) => (a.isOpen === b.isOpen ? 0 : a.isOpen ? -1 : 1));
    this.polls.forEach(poll => {
      poll.requests.sort((a, b) => b.id - a.id);
    });
    console.log(this.polls);
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
    this.clearFlags();
  }

  clearFlags() {
    this.voting = false;
    this.toggling = false;
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
    return [
      {
        backgroundColor: this.colors.slice(0, poll.requests.length),
        borderColor: '#000'
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
      this.voting = true;
      const vote = new InputPollVote({
        user_id: this.authService.currentUser.id,
        streamer_poll_request_id: pollRequest.id
      });
      this.streamerPollsVotesService.create(vote).subscribe(vote => {
        console.log(vote);
      });
    } else {
      this.voting = true;
      const vote = pollRequest.votes.filter(vote => vote.user.id === this.authService.currentUser.id)[0];

      this.streamerPollsVotesService.delete(vote.id).subscribe(v => {
        console.log(`deleted ${v}`);
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
    return !this.toggling && this.view === ParentComponent.BotComponent;
  }

  shouldShowChart(poll: StreamerPoll) {
    const { data } = this.charts[poll.id];
    return this.userHasVoted(poll) && !this.hiddenGraphs.includes(poll.id) && data.length
      ? data.reduce((prev, next) => prev + next) > 0
      : false;
  }

  shouldShowVoteButton(poll: StreamerPoll, pollRequest: StreamerPollRequest) {
    if (this.view === ParentComponent.ViewerDashboardComponent) {
      return (
        poll.isOpen &&
        ((this.userHasVoted(poll) && this.userHasVotedOnThisRequest(pollRequest)) || !this.userHasVoted(poll))
      );
    }
    return false;
  }

  shouldShowAddPoll() {
    return this.view === ParentComponent.BotComponent;
  }

  shouldShowPlayButton(poll: StreamerPoll) {
    return !this.toggling && poll.isOpen && this.view === ParentComponent.BotComponent;
  }

  togglePoll(poll: StreamerPoll) {
    this.toggling = true;
    poll.isOpen = !poll.isOpen;
    this.streamerPollsService.update(poll).subscribe(poll => {
      console.log(poll);
    });
  }

  playVote(poll: StreamerPoll, pollRequest: StreamerPollRequest) {
    this.botService.play(pollRequest.request);
    this.togglePoll(poll);
  }

  canEditRequests(poll: StreamerPoll): boolean {
    return !this.toggling && this.view === ParentComponent.BotComponent;
  }

  editRequests(poll: StreamerPoll) {
    this.botService.editPollRequests(poll, poll.requests);
  }

  canToggleGraph(): boolean {
    return !this.toggling && this.view === ParentComponent.BotComponent;
  }

  toggleGraph(poll: StreamerPoll) {
    if (this.hiddenGraphs.includes(poll.id)) {
      this.hiddenGraphs = this.hiddenGraphs.filter(hg => hg !== poll.id);
    } else {
      this.hiddenGraphs.push(poll.id);
    }
  }

  canDeletePoll(): boolean {
    return !this.toggling && this.view === ParentComponent.BotComponent;
  }

  deletePoll(poll: StreamerPoll) {
    console.log(poll);
    this.botService.deletePoll(poll);
  }
}

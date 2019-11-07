import { Component, OnInit, Input } from '@angular/core';

import { Request } from 'app/models/request';
import { MatDialog } from '@angular/material';
import { AuthService } from 'app/core/services/auth.service';
import { BotService } from 'app/core/services/bot.service';
import { RequestCardType } from '../../enums/request-card-type';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentComponent } from 'app/enums/parent-component';
import { RequestCardSortType } from 'app/enums/request-card-sort-type';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import * as Fuse from 'fuse.js';
import { User } from 'app/models/user';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent implements OnInit {
  @Input() requests: Request[];
  @Input() type: RequestCardType;

  view: ParentComponent;

  liking = false;

  private requestCardSortType = RequestCardSortType;

  sortTypes = Object.keys(RequestCardSortType);
  sortType: RequestCardSortType = RequestCardSortType.Date;
  sortedFor: RequestCardSortType = RequestCardSortType.Date;
  sortedCopy: Request[];

  searchControl: FormControl = new FormControl('');
  requestsDisplay: Request[];

  fuse: Fuse<any>;

  constructor(
    private botService: BotService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.view = this.route.component['name'];
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.search(val);
    });
  }

  ngOnChanges(data) {}

  get requestQueue() {
    if (
      this.view === ParentComponent.BotComponent &&
      this.type === RequestCardType.REQUEST_QUEUE &&
      this.sortType !== RequestCardSortType.Date
    ) {
      this.sortedCopy = Object.assign([], this.requestsDisplay ? this.requestsDisplay : this.requests);
      this.sortRequests(this.sortedCopy);

      return this.sortedCopy;
    }
    this.sortedFor = RequestCardSortType.Date;
    return this.requestsDisplay ? this.requestsDisplay : this.requests;
  }

  search(term: string) {
    if (term) {
      const options = {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        keys: ['link', 'message', 'song', 'user.username', 'createdAt']
      };
      this.fuse = new Fuse(this.requests, options); // "list" is the item array
      const matches: Request[] = this.fuse.search(term);
      this.requestsDisplay = matches;
    } else {
      this.requestsDisplay = null;
    }
  }

  setMenuTarget(request: Request) {
    this.botService.menuTarget = request;
  }

  // TODO HAVE A WAY TO KNOW IF YOU ARE IN BOT MODE OR VIEW MODE

  canPlay(): boolean {
    return this.view === ParentComponent.BotComponent && this.type === RequestCardType.REQUEST_QUEUE;
  }

  sortRequests(requests: Request[]) {
    switch (this.sortType) {
      case RequestCardSortType.Likes:
        requests.sort((a, b) => {
          if (a.likes.length === b.likes.length) {
            return Number(new Date(a['createdAt'])) - Number(new Date(a['createdAt']));
          }
          return b.likes.length - a.likes.length;
        });
        this.sortedFor = RequestCardSortType.Likes;
        break;
    }
  }

  canSort(): boolean {
    return (
      this.view === ParentComponent.BotComponent &&
      this.type === RequestCardType.REQUEST_QUEUE &&
      this.botService.requestQueue.length > 0
    );
  }

  setSortType(sortType: RequestCardSortType) {
    this.sortType = sortType;
  }

  canUndo(): boolean {
    return this.view === ParentComponent.BotComponent && this.type === RequestCardType.PLAYED_REQUESTS;
  }

  canEdit(): boolean {
    if (this.view === ParentComponent.ViewerDashboardComponent) {
      if (this.botService.menuTarget) {
        return this.botService.menuTarget.createdBy.id === this.authService.currentUser.id;
      }
      return false;
    }
    return false;
  }

  canLike(): boolean {
    return this.view === ParentComponent.ViewerDashboardComponent && this.type === RequestCardType.REQUEST_QUEUE;
  }

  canDelete(): boolean {
    if (this.view === ParentComponent.ViewerDashboardComponent) {
      if (this.botService.menuTarget) {
        return this.botService.menuTarget.createdBy.id === this.authService.currentUser.id;
      }
      return false;
    }
    if (this.view === ParentComponent.BotComponent) {
      return this.type === RequestCardType.REQUEST_QUEUE;
    }
    return false;
  }

  canDeleteAll(): boolean {
    if (this.view === ParentComponent.BotComponent) {
      return (
        (this.type === RequestCardType.REQUEST_QUEUE && this.botService.requestQueue.length > 0) ||
        (this.type === RequestCardType.PLAYED_REQUESTS && this.botService.playedRequests.length > 0)
      );
    }
    return false;
  }

  deleteAllRequests() {
    const dataset =
      this.type === RequestCardType.REQUEST_QUEUE ? this.botService.requestQueue : this.botService.playedRequests;
    this.botService.deleteAllRequests(dataset);
  }

  shouldShowNowPlaying(index: number) {
    return this.type === RequestCardType.PLAYED_REQUESTS && index === 0 && !this.requestsDisplay;
  }

  getBadge(index) {
    if (this.type === RequestCardType.REQUEST_QUEUE) {
      return index + 1;
    }
    return this.requests.length - index;
  }

  canAddToPoll(): boolean {
    return this.view === ParentComponent.BotComponent && this.type === RequestCardType.REQUEST_QUEUE;
  }

  canPlayRandom(): boolean {
    return (
      this.view === ParentComponent.BotComponent &&
      this.type === RequestCardType.REQUEST_QUEUE &&
      this.botService.requestQueue.length > 0
    );
  }

  getLikeColor(request: Request) {
    if (request.likes.filter(l => l.user.id === this.authService.currentUser.id).length) {
      return 'primary';
    }
    return 'warn';
  }

  toggleLike(request: Request) {
    this.botService.toggleLike(request, this.authService.currentUser);
  }
  shouldDisableMenu(request: Request) {
    if (this.view === ParentComponent.ViewerDashboardComponent) {
      return request.user.id !== this.authService.currentUser.id;
    }
    if (this.view === ParentComponent.BotComponent) {
      return this.type !== RequestCardType.REQUEST_QUEUE;
    }
  }

  getDate(request: Request): Date {
    return this.type === RequestCardType.REQUEST_QUEUE ? request.createdAt : request.played;
  }

  getId(): string {
    return this.type === RequestCardType.REQUEST_QUEUE ? 'request-queue' : 'played-requests';
  }

  editRequest() {
    const targetRequest: Request = this.botService.menuTarget;
    this.router.navigate(['request', targetRequest.id], {
      relativeTo: this.route
    });
  }

  getLikes(request: Request): string[] {
    return [`${request.likes.length}`, request.likes.length === 1 ? 'like' : 'likes'];
  }
}

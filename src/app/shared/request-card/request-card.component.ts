import { Component, OnInit, Input } from '@angular/core';

import { Request } from 'app/models/request';
import { MatDialog } from '@angular/material';
import { AuthService } from 'app/core/services/auth.service';
import { BotService } from 'app/core/services/bot.service';
import { RequestCardType } from '../../enums/request-card-type';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentComponent } from 'app/enums/parent-component';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent implements OnInit {
  @Input() requests: Request[];
  @Input() type: RequestCardType;

  view: ParentComponent;

  constructor(
    private botService: BotService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.view = this.route.component['name'];
  }

  setMenuTarget(request: Request) {
    this.botService.menuTarget = request;
  }

  // TODO HAVE A WAY TO KNOW IF YOU ARE IN BOT MODE OR VIEW MODE

  canPlay(): boolean {
    return this.view === ParentComponent.BotComponent && this.type === RequestCardType.REQUEST_QUEUE;
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
  }

  canAddToPoll(): boolean {
    return this.view === ParentComponent.BotComponent && this.type === RequestCardType.REQUEST_QUEUE;
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
}

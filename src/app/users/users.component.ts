import { Component, OnInit } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { flipInY, fadeIn, rubberBand, slideInUp } from 'ng-animate';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from 'app/core/services/auth.service';
import { BotService } from 'app/core/services/bot.service';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  constructor(private location: Location, private botService: BotService, private route: ActivatedRoute) {}

  ngOnInit() {}
}

import { Component, OnInit } from "@angular/core";
import { trigger, transition, useAnimation } from "@angular/animations";
import { slideInUp } from "ng-animate";

@Component({
  selector: "app-my-bot",
  templateUrl: "./my-bot.component.html",
  styleUrls: ["./my-bot.component.css"],
  animations: [
    trigger("slideInUp", [transition("* => *", useAnimation(slideInUp))])
  ]
})
export class MyBotComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

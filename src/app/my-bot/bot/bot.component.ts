import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "app/core/services/user.service";
import { UserValidator } from "app/core/extenders/UserValidator";
import { AuthService } from "app/core/services/auth.service";

@Component({
  selector: "app-bot",
  templateUrl: "./bot.component.html",
  styleUrls: ["./bot.component.css"]
})
export class BotComponent implements OnInit {
  loading = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loading = false;
  }
}

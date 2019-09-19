import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/core/services/auth.service";
import { User } from "../../models/user";
import { UserService } from "app/core/services/user.service";

@Component({
  selector: "app-all-users",
  templateUrl: "./all-users.component.html",
  styleUrls: ["./all-users.component.css"]
})
export class AllUsersComponent implements OnInit {
  users: User[] = [];
  errorMsg: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.userService.getAll().subscribe((users: User[]) => {
      this.users = users;
    });
  }
}

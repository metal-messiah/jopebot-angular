import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { UserService } from 'app/core/services/user.service';
import { User } from 'app/models/user';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    const redirect: string = params.get('redirect');
    console.log(redirect);
    const user = await this.authService.fetchCurrentUserFromDB().toPromise();
    if (user) {
      this.authService.currentUser = new User(user);
    }
    console.log(this.authService.currentUser);
    this.router.navigate([redirect]);
  }
}

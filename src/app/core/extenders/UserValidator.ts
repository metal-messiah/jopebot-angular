import { User } from "app/models/user";
import eh from "../../interfaces/error-handler";
import { AuthService } from "../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../services/user.service";

export class UserValidator {
  userFromParam: User;
  errorMsg: string;

  constructor(route: ActivatedRoute, userService: UserService) {
    route.paramMap.subscribe(async params => {
      const userId = params.get("userid");
      const [err, user] = await eh(userService.getOneById(userId).toPromise());
      if (err) {
        this.errorMsg = `${userId} does not reference a valid user...`;
      } else {
        this.userFromParam = user;
      }
    });
  }
}

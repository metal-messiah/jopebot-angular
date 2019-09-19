import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthService } from "./services/auth.service";
import { RoutingStateService } from "./services/routing-state.service";
import { UpdateService } from "./services/update.service";
import { AuthGuard } from "./services/auth.guard";
import { RestService } from "./services/rest.service";
import { CanDeactivateGuard } from "./services/can-deactivate.guard";
import { UserService } from "./services/user.service";

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  providers: [
    AuthService,
    RoutingStateService,
    UpdateService,
    AuthGuard,
    RestService,
    UserService,
    CanDeactivateGuard
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(
        "CoreModule is already loaded. Import it in the AppModule only"
      );
    }
  }
}

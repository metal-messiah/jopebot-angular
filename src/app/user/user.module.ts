import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserRoutingModule } from "./user-routing.module";
import { UserComponent } from "./user.component";
import { ViewerDashboardComponent } from "./viewer-dashboard/viewer-dashboard.component";
import { SharedModule } from "app/shared/shared.module";
import { AllUsersComponent } from './all-users/all-users.component';

@NgModule({
  declarations: [UserComponent, ViewerDashboardComponent, AllUsersComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule]
})
export class UserModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";
import { ViewerDashboardComponent } from "./viewer-dashboard/viewer-dashboard.component";
import { SharedModule } from "app/shared/shared.module";
import { AllUsersComponent } from "./all-users/all-users.component";

@NgModule({
  declarations: [UsersComponent, ViewerDashboardComponent, AllUsersComponent],
  imports: [CommonModule, UsersRoutingModule, SharedModule]
})
export class UsersModule {}

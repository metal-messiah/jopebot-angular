import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";
import { ViewerDashboardComponent } from "./viewer-dashboard/viewer-dashboard.component";
import { SharedModule } from "app/shared/shared.module";
import { AllUsersComponent } from "./all-users/all-users.component";
import { RequestComponent } from "./request/request.component";
import { ScrollingModule } from "@angular/cdk/scrolling";

@NgModule({
  declarations: [
    UsersComponent,
    ViewerDashboardComponent,
    AllUsersComponent,
    RequestComponent
  ],
  imports: [CommonModule, UsersRoutingModule, SharedModule, ScrollingModule]
})
export class UsersModule {}

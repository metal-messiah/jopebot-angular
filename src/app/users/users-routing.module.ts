import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../core/services/auth.guard";
import { UsersComponent } from "./users.component";
import { ViewerDashboardComponent } from "./viewer-dashboard/viewer-dashboard.component";
import { AllUsersComponent } from "./all-users/all-users.component";
import { UserGuard } from "app/core/services/user.guard";
import { RequestComponent } from "./request/request.component";
import { OwnedGuard } from "app/core/services/owned.guard";
import { SocketGuard } from "app/core/services/socket.guard";

const routes: Routes = [
  {
    path: "users",
    component: UsersComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: AllUsersComponent
      },
      {
        path: ":userid",
        component: ViewerDashboardComponent,
        canActivate: [UserGuard, SocketGuard]
      },
      {
        path: ":userid/request",
        component: RequestComponent,
        canActivate: [UserGuard]
      },
      {
        path: ":userid/request/:requestid",
        component: RequestComponent,
        canActivate: [UserGuard, OwnedGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}

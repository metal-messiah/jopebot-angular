import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../core/services/auth.guard";
import { UsersComponent } from "./users.component";
import { ViewerDashboardComponent } from "./viewer-dashboard/viewer-dashboard.component";
import { AllUsersComponent } from "./all-users/all-users.component";
import { UserGuard } from "app/core/services/user.guard";
import { RequestComponent } from "./request/request.component";

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
        canActivate: [UserGuard]
      },
      {
        path: ":userid/request",
        component: RequestComponent,
        canActivate: [UserGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}

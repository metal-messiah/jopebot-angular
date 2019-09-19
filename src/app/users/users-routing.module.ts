import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../core/services/auth.guard";
import { UsersComponent } from "./users.component";
import { ViewerDashboardComponent } from "./viewer-dashboard/viewer-dashboard.component";
import { AllUsersComponent } from "./all-users/all-users.component";

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
        component: ViewerDashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}

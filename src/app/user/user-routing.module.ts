import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../core/services/auth.guard";
import { UserComponent } from "./user.component";
import { ViewerDashboardComponent } from "./viewer-dashboard/viewer-dashboard.component";
import { AllUsersComponent } from "./all-users/all-users.component";

const routes: Routes = [
  {
    path: "users",
    component: UserComponent,
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
export class UserRoutingModule {}

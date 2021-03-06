import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './shared/callback/callback.component';
import { PathNotFoundComponent } from './shared/path-not-found/path-not-found.component';
import { CanDeactivateGuard } from './core/services/can-deactivate.guard';
import { NotAuthorizedComponent } from './shared/not-authorized/not-authorized.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '/' },
  { path: 'callback', component: CallbackComponent },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '**', component: PathNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackComponent } from './callback/callback.component';
import { PathNotFoundComponent } from './path-not-found/path-not-found.component';
import { CanDeactivateGuard } from '../core/services/can-deactivate.guard';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DisplayDialogComponent } from './display-dialog/display-dialog.component';
import { RequestCardComponent } from './request-card/request-card.component';
import { PollCardComponent } from './poll-card/poll-card.component';
import { ChartsModule } from 'ng2-charts';
import { SelectDialogComponent } from './select-dialog/select-dialog.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { ShortcutsCardComponent } from './shortcuts-card/shortcuts-card.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

@NgModule({
  imports: [CommonModule, CustomMaterialModule, FormsModule, ReactiveFormsModule, ChartsModule],
  declarations: [
    CallbackComponent,
    PathNotFoundComponent,
    NotAuthorizedComponent,
    ConfirmDialogComponent,
    DisplayDialogComponent,
    SelectDialogComponent,
    InputDialogComponent,
    RequestCardComponent,
    PollCardComponent,
    ShortcutsCardComponent
  ],
  exports: [
    CallbackComponent,
    PathNotFoundComponent,
    NotAuthorizedComponent,
    ConfirmDialogComponent,
    DisplayDialogComponent,
    SelectDialogComponent,
    InputDialogComponent,
    CustomMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RequestCardComponent,
    PollCardComponent,
    ShortcutsCardComponent
  ],
  entryComponents: [ConfirmDialogComponent, DisplayDialogComponent, SelectDialogComponent, InputDialogComponent]
})
export class SharedModule {}

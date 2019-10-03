import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CallbackComponent } from "./callback/callback.component";
import { PathNotFoundComponent } from "./path-not-found/path-not-found.component";
import { CanDeactivateGuard } from "../core/services/can-deactivate.guard";
import { CustomMaterialModule } from "./custom-material/custom-material.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { DisplayDialogComponent } from "./display-dialog/display-dialog.component";

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CallbackComponent,
    PathNotFoundComponent,
    ConfirmDialogComponent,
    DisplayDialogComponent
  ],
  exports: [
    CallbackComponent,
    PathNotFoundComponent,
    ConfirmDialogComponent,
    DisplayDialogComponent,
    CustomMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [ConfirmDialogComponent, DisplayDialogComponent]
})
export class SharedModule {}

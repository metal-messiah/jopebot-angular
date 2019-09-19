import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackComponent } from './callback/callback.component';
import { PathNotFoundComponent } from './path-not-found/path-not-found.component';
import { CanDeactivateGuard } from '../core/services/can-deactivate.guard';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, CustomMaterialModule],
  declarations: [CallbackComponent, PathNotFoundComponent],
  exports: [
    CallbackComponent,
    PathNotFoundComponent,
    CustomMaterialModule,
    HttpClientModule
  ]
})
export class SharedModule {}

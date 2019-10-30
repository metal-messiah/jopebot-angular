import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackbarQueueService {
  snacks = [];
  snacking = false;
  private snackConfig: MatSnackBarConfig = {
    duration: 2000
  };

  constructor(private snackbar: MatSnackBar) {}

  add(label: string, action?: string, config?: any) {
    this.snacks.push({ label, action: action || null, config: config || this.snackConfig });
    if (!this.snacking) {
      this.show();
    }
  }

  show() {
    const snack = this.snacks.length ? this.snacks.shift() : null;
    if (snack) {
      this.snacking = true;
      this.snackbar
        .open(snack.label, snack.action, snack.config)
        .afterDismissed()
        .subscribe(() => {
          this.show();
        });
    } else {
      this.snacking = false;
    }
  }
}

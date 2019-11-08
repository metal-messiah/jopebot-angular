import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  question: string;
  options: string[];
  optionsColors: string[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.question = data.question;
    if (data.options != null) {
      this.options = data.options;
    }
    if (data.optionsColors !== null) {
      this.optionsColors = data.optionsColors;
    }
  }

  ngOnInit() {}
}

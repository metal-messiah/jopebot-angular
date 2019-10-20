import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-dialog',
  templateUrl: './select-dialog.component.html',
  styleUrls: ['./select-dialog.component.css']
})
export class SelectDialogComponent implements OnInit {
  title: string;
  options: any[];
  labels: string[]; // in the length and order of the options
  selectControl: FormControl;

  disclaimer: string;

  extraButtonLabels: string[];
  extraButtonActions: string[];

  initialData: any[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.options = data.options;
    this.initialData = data.initialData;
    const matches = this.options.filter(o => this.initialData.map(i => i.id).includes(o.id));
    this.selectControl = new FormControl(matches, [Validators.required]);
    this.labels = data.labels;
    this.extraButtonLabels = data.extraButtonLabels; // list of strings
    this.extraButtonActions = data.extraButtonActions; // list of functions
    this.disclaimer = data.disclaimer;
  }

  ngOnInit() {}

  shouldCheck(option) {
    return this.initialData.map(d => d.id).includes(option.id);
  }
}

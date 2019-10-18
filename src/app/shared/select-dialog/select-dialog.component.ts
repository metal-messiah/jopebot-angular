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

  extraButtonLabels: string[];
  extraButtonActions: string[];

  initialData: any[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.options = data.options;
    console.log(this.options);
    this.initialData = data.initialData;
    console.log(this.initialData);
    const matches = this.options.filter(o => this.initialData.map(i => i.id).includes(o.id));
    console.log(matches);
    this.selectControl = new FormControl(matches, [Validators.required]);
    this.labels = data.labels;
    console.log(this.labels);
    this.extraButtonLabels = data.extraButtonLabels; // list of strings
    this.extraButtonActions = data.extraButtonActions; // list of functions
  }

  ngOnInit() {}

  shouldCheck(option) {
    return this.initialData.map(d => d.id).includes(option.id);
  }
}

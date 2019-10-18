import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.css']
})
export class InputDialogComponent {
  title: string;
  placeholder: string;
  inputType: string;
  validators: ValidatorFn[];
  inputControl: FormControl;
  initialValue: string | number;

  constructor(public dialogRef: MatDialogRef<InputDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.placeholder = data.placeholder;
    this.inputType = data.inputType;
    this.validators = data.validators;
    this.initialValue = data.initialValue;

    this.inputControl = new FormControl(this.initialValue, this.validators);
  }
}

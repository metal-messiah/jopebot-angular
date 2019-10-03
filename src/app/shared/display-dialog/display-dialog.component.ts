import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "mds-display-dialog",
  templateUrl: "./display-dialog.component.html",
  styleUrls: ["./display-dialog.component.css"]
})
export class DisplayDialogComponent implements OnInit {
  title: string;
  content: string;
  options: string[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.content = data.content.trim();
    console.log(this.content);
    if (data.options != null) {
      this.options = data.options;
    }
  }

  ngOnInit() {}
}

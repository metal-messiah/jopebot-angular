import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-streamer-songs",
  templateUrl: "./streamer-songs.component.html",
  styleUrls: ["./streamer-songs.component.css"]
})
export class StreamerSongsComponent implements OnInit {
  SERVER_URL = "http://localhost:3001/api/streamer-songs/submit-form";
  uploadForm: FormGroup;
  msg: string;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      songs: [""]
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get("songs").setValue(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append("file", this.uploadForm.get("songs").value);

    this.httpClient
      .post<any>(this.SERVER_URL, formData, {
        withCredentials: true
      })
      .subscribe(
        res => {
          this.uploadForm.get("songs").setValue("");
          this.msg = "File Uploaded Successfully";
        },
        err => {
          this.msg = "File Upload Failed! :(";
        }
      );
  }
}

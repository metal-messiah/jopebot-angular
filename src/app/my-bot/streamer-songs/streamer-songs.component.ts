import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { StreamerSongsService } from "app/core/services/streamer-songs.service";
import { AuthService } from "app/core/services/auth.service";
import { StreamerSong } from "app/models/streamer-song";

@Component({
  selector: "app-streamer-songs",
  templateUrl: "./streamer-songs.component.html",
  styleUrls: ["./streamer-songs.component.css"]
})
export class StreamerSongsComponent implements OnInit {
  SERVER_URL = "http://localhost:3001/api/streamer-songs/submit-form";
  uploadForm: FormGroup;
  msg = "Click To Upload New File";
  loading = true;
  buttonText = "";

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private streamerSongsService: StreamerSongsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      songs: [""]
    });

    if (this.authService.currentUser) {
      this.getExistingSongs();
    } else {
      setTimeout(() => this.getExistingSongs(), 1000);
    }
  }

  getExistingSongs() {
    this.streamerSongsService
      .getAll({
        user_id: this.authService.currentUser.id
      })
      .subscribe((streamerSongs: StreamerSong[]) => {
        if (streamerSongs.length) {
          this.buttonText = `Last Updated At ${streamerSongs[0].updatedAt.toLocaleString()}`;
          this.loading = false;
        }
      });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const songs = this.uploadForm.get("songs");
      this.buttonText = file.name;
      songs.setValue(file);
      this.submit();
    }
  }

  submit() {
    const formData = new FormData();
    formData.append("file", this.uploadForm.get("songs").value);
    this.loading = true;
    this.httpClient
      .post<any>(this.SERVER_URL, formData, {
        withCredentials: true
      })
      .subscribe(
        res => {
          console.log(res);
          this.msg = "File Uploaded Successfully";
          this.getExistingSongs();
        },
        err => {
          this.msg = "File Upload Failed! :(";
          this.getExistingSongs();
        }
      );
  }
}

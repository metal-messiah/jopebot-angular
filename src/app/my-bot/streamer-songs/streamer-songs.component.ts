import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StreamerSongsService } from 'app/core/services/streamer-songs.service';
import { AuthService } from 'app/core/services/auth.service';
import { StreamerSong } from 'app/models/streamer-song';
import { ActivatedRoute } from '@angular/router';
import { BotService } from 'app/core/services/bot.service';

@Component({
  selector: 'app-streamer-songs',
  templateUrl: './streamer-songs.component.html',
  styleUrls: ['./streamer-songs.component.css']
})
export class StreamerSongsComponent implements OnInit {
  uploadForm: FormGroup;
  msg = 'Click To Upload New File';
  buttonText = '';
  streamerIdParam: number;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private streamerSongsService: StreamerSongsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private botService: BotService
  ) {}

  ngOnInit() {
    console.log('streamer songs compononet');
    this.uploadForm = this.formBuilder.group({
      songs: ['']
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const songs = this.uploadForm.get('songs');
      this.buttonText = file.name;
      songs.setValue(file);
      this.submit();
    }
  }

  submit() {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('songs').value);
    this.loading = true;
    this.streamerSongsService.submitForm(this.botService.user.id, formData).subscribe(
      res => {
        console.log(res);
        this.msg = 'File Uploaded Successfully';
        this.loading = false;
        this.botService.getExistingSongs();
      },
      err => {
        this.msg = 'File Upload Failed! :(';
        this.loading = false;
        this.botService.getExistingSongs();
      }
    );
  }
}

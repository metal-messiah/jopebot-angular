import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  NgZone
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import eh from "../../interfaces/error-handler";
import { StreamerSongsService } from "app/core/services/streamer-songs.service";
import { StreamerSong } from "app/models/streamer-song";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.css"]
})
export class RequestComponent implements OnInit {
  streamerIdParam;
  fetching = { songs: false };
  songs: StreamerSong;

  dataFields: string[] = [];
  fieldsControl: FormControl;

  constructor(
    private route: ActivatedRoute,
    private streamerSongsService: StreamerSongsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.streamerIdParam = params.get("userid");
      console.log(this.streamerIdParam);
      this.updateSongs();
    });
  }

  async updateSongs() {
    console.log("update songs");
    this.fetching.songs = true;
    this.streamerSongsService
      .getAll({ user_id: this.streamerIdParam })
      .subscribe((resp: StreamerSong[]) => {
        this.songs = resp.length ? resp[0] : null;
        this.fetching.songs = false;

        console.log(this.songs);

        this.dataFields = Object.keys(this.songs.data[0]);

        // by default show 6 fields
        this.fieldsControl = new FormControl(this.dataFields.slice(0, 6), [
          Validators.required
        ]);
        console.log(this.fieldsControl);
        this.fetching.songs = false;
      });
  }
}

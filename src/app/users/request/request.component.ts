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

import {
  debounce,
  debounceTime,
  delay,
  finalize
} from "rxjs/internal/operators";

import * as Fuse from "fuse.js";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.css"]
})
export class RequestComponent implements OnInit {
  streamerIdParam;
  fetching = { songs: false };
  songs: StreamerSong;

  display: any[] = [];

  selectIsOpen = false;

  dataFields: string[] = [];

  fieldsControl: FormControl;
  textControl: FormControl;

  fuse: Fuse<any>;

  constructor(
    private route: ActivatedRoute,
    private streamerSongsService: StreamerSongsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.streamerIdParam = params.get("userid");
      this.fetchSongs();
    });

    this.textControl = new FormControl("", [Validators.required]);
    this.textControl.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      this.search(val);
    });
  }

  async fetchSongs() {
    this.fetching.songs = true;
    this.streamerSongsService
      .getAll({ user_id: this.streamerIdParam })
      .subscribe((resp: StreamerSong[]) => {
        this.songs = resp.length ? resp[0] : null;
        this.fetching.songs = false;

        this.dataFields = Object.keys(this.songs.data[0]);
        this.display = this.songs.data;
        console.log(this.display.length);

        // by default show 6 fields
        this.fieldsControl = new FormControl(this.dataFields.slice(0, 4), [
          Validators.required
        ]);

        this.fetching.songs = false;
      });
  }

  getRowWidth(): string {
    return `${window.innerWidth / this.fieldsControl.value.length - 10}px`;
  }

  onBlur() {
    this.selectIsOpen = false;
  }

  onFocus() {
    this.selectIsOpen = true;
  }

  search(term: string) {
    const options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.dataFields
    };
    this.fuse = new Fuse(this.songs.data, options); // "list" is the item array
    this.display = this.fuse.search(term);
  }

  onSongClick(song: any) {
    console.log(`Click on Song ${song.songName}`);
  }
}

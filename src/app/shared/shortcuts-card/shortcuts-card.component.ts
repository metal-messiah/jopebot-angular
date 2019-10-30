import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { StreamerPoll } from 'app/models/streamer-poll';
import { ParentComponent } from 'app/enums/parent-component';

import { Route, ActivatedRoute } from '@angular/router';

import { ChatService } from 'app/core/services/chat.service';
import { AuthService } from 'app/core/services/auth.service';
import { MatDialog } from '@angular/material';
import { InputDialogComponent } from '../input-dialog/input-dialog.component';
import { Validators } from '@angular/forms';
import { BotService } from 'app/core/services/bot.service';
import { Request } from 'app/models/request';
import { User } from 'app/models/user';

@Component({
  selector: 'app-shortcuts-card',
  templateUrl: './shortcuts-card.component.html',
  styleUrls: ['./shortcuts-card.component.css']
})
export class ShortcutsCardComponent implements OnInit {
  @Input() polls: StreamerPoll[];
  view: ParentComponent;

  public charts = {};
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private botService: BotService
  ) {}

  ngOnInit() {
    this.view = this.route.component['name'];
  }

  postLink() {
    const link = `Check out my request list, polls, and more at https://jopebot-web-beta.herokuapp.com/users/${this.authService.currentUser.id}`;
    this.chatService.sendMessage(link, this.botService.user).subscribe(() => {
      console.log('sent message');
    });
  }

  async generateFakeRequests() {
    console.log('generate fake requests');
    let i = 0;
    const messages = [
      'do my request!',
      'This is the best request',
      'Pay attention to me',
      'Have you ever seen something like this?',
      "I don't think you're capable of this one!"
    ];
    const songs = [
      JSON.stringify({
        Name: '(sic)',
        Artist: 'Slipknot',
        Album: 'Slipknot',
        Genre: 'Nu-Metal',
        Charter: 'anglebracket',
        Year: '1999',
        Playlist: 'Custom songs\\Slipknot',
        lyrics: true,
        modchart: false,
        songlength: 240864
      }),
      JSON.stringify({
        Name: 'Beat It',
        Artist: 'Michael Jackson',
        Album: 'Thriller',
        Genre: 'Pop Rock',
        Charter: 'Unknown Charter',
        Year: '1983',
        Playlist: 'Guitar Hero games\\Guitar Hero World Tour',
        lyrics: true,
        modchart: false,
        songlength: 278229
      }),
      JSON.stringify({
        Name: '(One of Those) Crazy Girls',
        Artist: 'Paramore',
        Album: 'Paramore',
        Genre: 'Alternative',
        Charter: 'GreenPanda12 & Ultimate_MANG0',
        Year: '2013',
        Playlist: 'Custom songs\\Paramore',
        lyrics: true,
        modchart: false,
        songlength: 216363
      })
    ];
    const links = [
      new URL('https://giphy.com'),
      new URL('https://catadoptionteam.org/'),
      new URL('https://www.adoptapet.com/dog-adoption?geo_range=50')
    ];

    while (i < 5) {
      i++;
      const request = new Request({
        // user: this.authService.currentUser,
        user: new User({ id: 178011381 }), // Jope__Bot's user id
        streamer: this.botService.user,
        message: messages.splice(Math.floor(Math.random() * messages.length), 1)[0],
        song: songs.splice(Math.floor(Math.random() * songs.length), 1)[0],
        link: links.splice(Math.floor(Math.random() * links.length), 1)[0]
      });

      this.botService.submitNewRequest(request).subscribe(r => console.log('added ', r));
    }
  }
}

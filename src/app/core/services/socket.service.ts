import io from 'socket.io-client';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { Tables } from 'app/enums/tables';

export class SocketService {
  io: io;
  attempts = 0;
  success = false;

  refreshDatasets$: Subject<Tables> = new Subject<Tables>();

  constructor(private http: HttpClient, private rest: RestService) {
    this.io = io({ autoConnect: false });
  }

  connect(userId) {
    if (this.attempts < 5 && !this.success) {
      this.attempts++;
      console.log('Attempt to connect to socket -- ', this.attempts);
      this.io = io(`${this.rest.getHost()}/${userId}`);
      this.io.on('connect', data => {
        console.log('connected to room', userId);
        this.success = true;
        this.attempts = 0;
        setTimeout(() => (this.success = false), 5000);
      });
      this.io.on('INFO', data => {
        console.log(data);
      });
      this.io.on('REFRESH', table => {
        table = table.replace(/_/g, '-');
        this.refreshDatasets$.next(table);
      });
      this.io.on('disconnect', data => {
        console.log(data);
      });

      setTimeout(() => {
        this.connect(userId);
      }, 1000);
    }
  }

  disconnect() {
    if (this.io) {
      this.io.disconnect();
    }
  }

  createRoom(userId: number): Observable<void> {
    console.log('create room');
    const url = this.rest.getHost() + `/api/socket/${userId}`;
    return this.http.post<void>(url, { withCredentials: true });
  }

  destroyRoom(userId: number): Observable<void> {
    const url = this.rest.getHost() + `/api/socket/${userId}`;
    return this.http.delete<void>(url, { withCredentials: true });
  }

  getRoomIds(): Observable<number[]> {
    const url = this.rest.getHost() + `/api/socket`;
    return this.http.get<number[]>(url, { withCredentials: true });
  }
}

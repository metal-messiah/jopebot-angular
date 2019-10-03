import io from "socket.io-client";
import { Observable, of, Subject, Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RestService } from "./rest.service";

export class SocketService {
  io: io;

  refreshDatasets$: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private rest: RestService) {
    console.log("*********** SOCKET SERVICE **************");
    this.io = io({ autoConnect: false });
  }

  connect(userId) {
    this.io = io(`http://localhost:3001/${userId}`);
    this.io.on("connect", function(data) {
      console.log("connected to room", userId);
    });
    this.io.on("INFO", function(data) {
      console.log(data);
    });
    this.io.on("REFRESH", () => {
      this.refreshDatasets$.next();
    });
    this.io.on("disconnect", function(data) {
      console.log(data);
    });
  }

  disconnect() {
    if (this.io) {
      this.io.disconnect();
    }
  }

  createRoom(userId: number): Observable<void> {
    const url = this.rest.getHost() + `/api/socket/${userId}`;
    return this.http.post<void>(url, { withCredentials: true });
  }

  destroyRoom(userId: number): Observable<void> {
    const url = this.rest.getHost() + `/api/socket/${userId}`;
    return this.http.delete<void>(url, { withCredentials: true });
  }
}

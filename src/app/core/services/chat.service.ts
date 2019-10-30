import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { User } from 'app/models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  endpoint = `/api/chat`;

  constructor(protected http: HttpClient, protected rest: RestService, private authService: AuthService) {}

  sendMessage(message: string, user?: User): Observable<void> {
    user = user || this.authService.currentUser;
    const url = this.rest.getHost() + this.endpoint;
    return this.http.post<void>(url, { message, user }, { headers: this.rest.getHeaders(), withCredentials: true });
  }
}

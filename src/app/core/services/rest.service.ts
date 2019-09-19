import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable()
export class RestService {
  private accessToken: string;
  private headers: HttpHeaders;

  constructor() {}

  public getHost(): string {
    return environment.WEB_SERVICE_HOST;
  }
  public getHeaders(): HttpHeaders {
    return this.headers;
  }
}

import { Injectable } from "@angular/core";
import { User } from "app/models/user";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RestService } from "./rest.service";
import { CrudService } from "../../interfaces/crud-service";
import { StreamerSettings } from "app/models/streamer-settings";

@Injectable({
  providedIn: "root"
})
export class StreamerSettingsService extends CrudService<StreamerSettings> {
  endpoint = "/api/streamer-settings";

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  protected createEntityFromObj(entityObj): StreamerSettings {
    return new StreamerSettings(entityObj);
  }
}

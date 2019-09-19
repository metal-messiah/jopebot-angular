import { Injectable } from "@angular/core";
import { User } from "app/models/user";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RestService } from "./rest.service";
import { CrudService } from "../../interfaces/crud-service";
import { StreamerUserPrivilege } from "app/models/streamer-user-privilege";

@Injectable({
  providedIn: "root"
})
export class StreamerUserPrivilegesService extends CrudService<
  StreamerUserPrivilege
> {
  endpoint = "/api/streamer-user-privileges";

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  protected createEntityFromObj(entityObj): StreamerUserPrivilege {
    return new StreamerUserPrivilege(entityObj);
  }
}

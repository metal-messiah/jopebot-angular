import { Injectable } from "@angular/core";
import { User } from "app/models/user";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RestService } from "./rest.service";
import { CrudService } from "../../interfaces/crud-service";
import { Request } from "../../models/request";

@Injectable({
  providedIn: "root"
})
export class RequestService extends CrudService<Request> {
  endpoint = "/api/requests";

  constructor(protected http: HttpClient, protected rest: RestService) {
    super(http, rest);
  }

  protected createEntityFromObj(entityObj): Request {
    return new Request(entityObj);
  }
}

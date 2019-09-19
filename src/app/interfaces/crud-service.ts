import { RestService } from "../core/services/rest.service";
import { HttpClient } from "@angular/common/http";
import { Entity } from "../models/entity";
import { Observable } from "rxjs";
import { map } from "rxjs/internal/operators";

export abstract class CrudService<T extends Entity> {
  protected abstract endpoint;

  protected constructor(
    protected http: HttpClient,
    protected rest: RestService
  ) {}

  protected abstract createEntityFromObj(entityObj): T;

  create(entity: T): Observable<T> {
    const url = this.rest.getHost() + this.endpoint;

    return this.http
      .post<T>(url, entity, {
        headers: this.rest.getHeaders(),
        withCredentials: true
      })
      .pipe(map(entityObj => this.createEntityFromObj(entityObj)));
  }

  getOneById(id: number | string): Observable<T> {
    const url = this.rest.getHost() + this.endpoint + `/${id}`;
    console.log(url);
    return this.http
      .get<T>(url, {
        headers: this.rest.getHeaders(),
        withCredentials: true
      })
      .pipe(map(entityObj => this.createEntityFromObj(entityObj)));
  }

  getAll(query?: object): Observable<T[]> {
    let queryString = "";
    if (query) {
      queryString =
        "?" +
        Object.keys(query)
          .map(key => {
            return (
              encodeURIComponent(key) + "=" + encodeURIComponent(query[key])
            );
          })
          .join("&");
    }

    const url = this.rest.getHost() + this.endpoint + `${queryString}`;
    console.log(url);
    return this.http
      .get<T[]>(url, {
        headers: this.rest.getHeaders(),
        withCredentials: true
      })
      .pipe(map(entityObj => entityObj.map(o => this.createEntityFromObj(o))));
  }

  update(updatedEntity: T): Observable<T> {
    const url = this.rest.getHost() + this.endpoint;
    return this.http
      .put<T>(url, updatedEntity, {
        headers: this.rest.getHeaders(),
        withCredentials: true
      })
      .pipe(map(entityObj => this.createEntityFromObj(entityObj)));
  }

  delete(id: number): Observable<any> {
    const url = this.rest.getHost() + this.endpoint + `/${id}`;
    return this.http.delete<T>(url, {
      headers: this.rest.getHeaders(),
      withCredentials: true
    });
  }
}

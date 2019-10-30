import { RestService } from '../core/services/rest.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

export abstract class CrudService<T> {
  protected abstract endpoint;
  protected abstract table;

  protected constructor(protected http: HttpClient, protected rest: RestService) {}

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
    return this.http
      .get<T>(url, {
        headers: this.rest.getHeaders(),
        withCredentials: true
      })
      .pipe(
        map(entityObj => {
          if (entityObj) { return this.createEntityFromObj(entityObj); } else { return null; }
        })
      );
  }

  getAll(query?: object): Observable<T[]> {
    const queryString = this.buildQueryStringFromObject(query);

    const url = this.rest.getHost() + this.endpoint + `${queryString}`;
    return this.http
      .get<T[]>(url, {
        headers: this.rest.getHeaders(),
        withCredentials: true
      })
      .pipe(
        map(entityObj => {
          if (entityObj) { return entityObj.map(o => this.createEntityFromObj(o)); } else { return null; }
        })
      );
  }

  update(updatedEntity: T): Observable<T> {
    const url = this.rest.getHost() + this.endpoint + '/' + updatedEntity['id'];
    return this.http
      .put<T>(url, updatedEntity, {
        headers: this.rest.getHeaders(),
        withCredentials: true
      })
      .pipe(
        map(entityObj => {
          if (entityObj) { return this.createEntityFromObj(entityObj); } else { return null; }
        })
      );
  }

  delete(id: number): Observable<any> {
    const url = this.rest.getHost() + this.endpoint + `/${id}`;
    return this.http.delete<T>(url, {
      headers: this.rest.getHeaders(),
      withCredentials: true
    });
  }

  exists(id: number): Observable<boolean> {
    const url = this.rest.getHost() + this.endpoint + `/${id}/exists`;
    return this.http.get<boolean>(url, {
      headers: this.rest.getHeaders(),
      withCredentials: true
    });
  }

  isOwned(id: number): Observable<boolean> {
    const url = this.rest.getHost() + this.endpoint + `/${id}/is-owned`;
    return this.http.get<boolean>(url, {
      headers: this.rest.getHeaders(),
      withCredentials: true
    });
  }

  count(query: object) {
    const queryString = this.buildQueryStringFromObject(query);

    const url = this.rest.getHost() + `/api/utilities/count/${this.table}` + `${queryString}`;
    return this.http.get<number>(url, {
      headers: this.rest.getHeaders(),
      withCredentials: true
    });
  }

  private buildQueryStringFromObject(query) {
    let queryString = '';
    if (query) {
      queryString =
        '?' +
        Object.keys(query)
          .map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
          })
          .join('&');
    }
    return queryString;
  }
}

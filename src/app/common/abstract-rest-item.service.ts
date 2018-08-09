import { HttpClient, HttpErrorResponse, HttpInterceptor  } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RestItem } from './rest-item';

@Injectable()
export abstract class AbstractRestItemService<T> implements OnInit {
    // private url : string;
    protected url: string;

    constructor(private http: HttpClient) {}

    // seems to be ignored on abstract services:
    ngOnInit() {
      console.log('AbstractRestItemService ngOninit called');
    }

    setUrl(url: string) {
      this.url = url;
    }

    // Read all REST Items
    getAll() {
      return this.http
        .get<RestItem[]>(this.url) // if you need to receive the full HTTP, then add second parameter {observe: 'response'} here
        .pipe(map(data => data), catchError(this.handleError));
    }

    // Read REST Item
    get(id: string): Observable<RestItem> {
      return this.getAll().pipe(
        map(restItems => {
          const found = restItems.find(restItem => restItem.id === id);
          // TODO: return error reflecting 404, if found is null
          return found;
          })
      );
    }

    // Save REST Item, i.e. create it, if it does not exist or update it, if it exists
    save(restItem: RestItem) {
      if (restItem.id) {
        return this.put(restItem);
      }
      return this.post(restItem);
    }

    // Delete REST Item
    delete(restItem: RestItem) {
      const url = `${this.url}/${restItem.id}`;

      return this.http.delete<RestItem>(url).pipe(catchError(this.handleError));
    }

    // Add new REST Item
    protected post(restItem: RestItem) {
      return this.http
        .post<RestItem>(this.url, restItem)
        .pipe(catchError(this.handleError));
    }

    // Update existing REST Item
    protected put(restItem: RestItem) {
      const url = `${this.url}/${restItem.id}`;

      return this.http.put<RestItem>(url, restItem).pipe(catchError(this.handleError));
    }

    protected handleError(res: HttpErrorResponse | any) {
      let errorMessage: String = '';
      if ('' + res.error === '[object ProgressEvent]') { // typeof(res.error) === ProgressEvent) {
        errorMessage = '(Unreachable API or CORS Problem?)';
      } else {
        errorMessage = res.error.message;
      }
      console.error(res.status + ' ' + res.statusText + ' ' + res.error || res.body.error);
      return observableThrowError(res.status + ' ' + res.statusText + ' ' + errorMessage || 'Server error');
    }
}

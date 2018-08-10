import { HttpClient, HttpErrorResponse, HttpInterceptor, HttpResponse  } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MarathonApp } from './marathon-app';
import { AbstractRestItemService } from '../common/abstract-rest-item.service';

@Injectable()
export class MarathonAppService extends AbstractRestItemService<MarathonApp> implements OnInit {

    protected url = 'http://94.130.187.229/service/marathon/v2/apps';

    constructor(http: HttpClient) {
      super(http);
      console.log('MarathonAppService ngOninit called');
      // this.setUrl(this.url);
    }

    // seems to be ignored:
    ngOnInit() {
      console.log('OnInit called on MarathonAppService');
      // super.setUrl(this.url);
    }

    // works also without explicit definition here:
    setUrl(url: string) {
      super.setUrl(this.url);
    }

    // needed for renaming getRestItems -> getMarathonApps
    getAll() {
      return super.getAll() as Observable<MarathonApp[]>;
    }

    get(id) {
      return super.get(id) as Observable<MarathonApp>;
    }

    save(marathonApp: MarathonApp) {
      return super.save(marathonApp) as Observable<MarathonApp>;
    }

    // delete (works also without explicit declaration here):
    delete(marathonApp: MarathonApp) {
      return super.delete(marathonApp) as Observable<MarathonApp>;
    }

    // post works also without explicit definition here. Can be defined only, if super.post is public or protected.
    protected post(marathonApp: MarathonApp) {
      return super.post(marathonApp) as Observable<MarathonApp>;
    }

    // put works also without explicit definition here. Can be defined only, if super.post is public or protected.
    protected put(marathonApp: MarathonApp) {
      return super.post(marathonApp) as Observable<MarathonApp>;
    }

    protected handleError(res: HttpErrorResponse | any) {
      return super.handleError(res);
    }

}

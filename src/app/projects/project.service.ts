import { HttpClient, HttpErrorResponse, HttpInterceptor, HttpResponse  } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Project } from './project';
import { AbstractRestItemService } from '../common/abstract-rest-item.service';

@Injectable()
export class ProjectService extends AbstractRestItemService<Project> implements OnInit {

    protected url = 'http://94.130.187.229/service/marathon/v2/groups';

    constructor(http: HttpClient) {
      super(http);
      console.log('ProjectService ngOninit called');
      // this.setUrl(this.url);
    }

    // seems to be ignored:
    ngOnInit() {
      console.log('OnInit called on ProjectService');
      // super.setUrl(this.url);
    }

    // works also without explicit definition here:
    setUrl(url: string) {
      super.setUrl(this.url);
    }

    // needed for renaming getRestItems -> getProjects
    getAll() {
      return super.getAll() as Observable<Project[]>;
    }

    get(id) {
      return super.get(id) as Observable<Project>;
    }

    save(project: Project) {
      return super.save(project) as Observable<Project>;
    }

    // delete (works also without explicit declaration here):
    delete(project: Project) {
      return super.delete(project) as Observable<Project>;
    }

    // post works also without explicit definition here. Can be defined only, if super.post is public or protected.
    protected post(project: Project) {
      return super.post(project) as Observable<Project>;
    }

    // put works also without explicit definition here. Can be defined only, if super.post is public or protected.
    protected put(project: Project) {
      return super.post(project) as Observable<Project>;
    }

    protected handleError(res: HttpErrorResponse | any) {
      return super.handleError(res);
    }

}

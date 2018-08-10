import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { MarathonApp } from './marathon-app';
import { MarathonAppService } from './marathon-app.service';
import { fromEvent } from 'rxjs';
import { map, catchError, sampleTime, startWith, switchMapTo } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { intervalBackoff } from 'backoff-rxjs';
export const INITIAL_INTERVAL_MS = 5000; // 5 sec, choose larger than mean response time of REST service called
export const MAX_INTERVAL_MS = 60000; // 1 min
export const BACKOFF_FACTOR = 3.162; // newInterval = oldInterval * 1.5


@Component({
  selector: 'my-marathon-apps',
  templateUrl: './marathon-apps.component.html',
  styleUrls: ['./marathon-apps.component.css']
})
export class MarathonAppsComponent implements OnInit {
  marathonApps: MarathonApp[];
  intervalBackoffNumber: number;
  intervalBackoffTimer$$: Observable<Observable<void | {}>>;
  project: String = '';
  exposedUrl: String = '/marathonapps';
  selectedMarathonApp: MarathonApp;
  addingMarathonApp = false;
  error: any;

  constructor(private router: Router,
    private marathonAppService: MarathonAppService,
    private route: ActivatedRoute) {}

  ngOnInit() {

    // calculate projects:
    this.route.params.forEach((params: Params) => {
      if (params['project'] !== undefined) {
        this.project = params['project'];
        this.exposedUrl = '/' + this.project + '/' + this.exposedUrl;
        // this.getMarathonApps(this.project);
      } else {
        this.project = '';
        // this.getMarathonApps();
      }
    });

    this.intervalBackoffTimer$$ =
      fromEvent(document, 'mousemove').pipe(

        // There could be many mousemoves, we'd want to sample only
        // with certain frequency
        sampleTime(INITIAL_INTERVAL_MS),

        // Start immediately
        startWith(null),

        // Resetting exponential interval operator
        switchMapTo(intervalBackoff({
          backoffDelay: (iteration, initialInterval) => Math.pow(BACKOFF_FACTOR, iteration) * initialInterval,
          initialInterval: INITIAL_INTERVAL_MS,
          maxInterval: MAX_INTERVAL_MS
        })),

        // mapping the code that returns an Observable of the void getAndAssignPosts$() function
        map( intervalBackoffNumber => {
          console.log('iteration since reset: ' + intervalBackoffNumber);
          this.intervalBackoffNumber = intervalBackoffNumber;
          return this.getAndAssignMarathonApps$(this.project);
        }),
      );
  }

  getAndAssignMarathonApps$(myProject: String = null): Observable<void | {}> {
    return this.marathonAppService.getAll().pipe (
      map(marathonApps => {
        const filteredMarathonApps = marathonApps.filter(app => app.project === myProject) as MarathonApp[];
        console.log(filteredMarathonApps);
        this.marathonApps = filteredMarathonApps;
      }),
      catchError(error => this.error = error)
    );
  }

  addMarathonApp(): void {
    this.addingMarathonApp = true;
    this.selectedMarathonApp = null;
  }

  close(savedMarathonApp: MarathonApp): void {
    this.addingMarathonApp = false;
  }

  deleteMarathonApp(marathonApp: MarathonApp, event: any): void {
    event.stopPropagation();
    this.marathonAppService.delete(marathonApp).subscribe(res => {
      this.marathonApps = this.marathonApps.filter(h => h !== marathonApp);
      if (this.selectedMarathonApp === marathonApp) {
        this.selectedMarathonApp = null;
      }
    }, error => (this.error = error));
  }

  // not sure, whether this handleError function makes sense. Errors are caught in getAll() already...
  protected handleError(error: any) {
    console.log(error);
    this.error = error;
    return error;
  }

  onSelect(marathonApp: MarathonApp): void {
    this.selectedMarathonApp = marathonApp;
    this.addingMarathonApp = false;
    this.router.navigate(['projects', this.project, 'marathonapps', this.selectedMarathonApp.name]);
  }

  gotoDetail(): void {
    this.router.navigate([this.exposedUrl, this.selectedMarathonApp.id]);
  }
}

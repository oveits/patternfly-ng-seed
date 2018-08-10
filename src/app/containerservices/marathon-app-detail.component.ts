import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MarathonApp } from './marathon-app';
import { MarathonAppService } from './marathon-app.service';

@Component({
  selector: 'app-marathon-app-detail',
  templateUrl: './marathon-app-detail.component.html',
  styleUrls: ['./marathon-app-detail.component.css']
})
export class MarathonAppDetailComponent implements OnInit {
  @Input() marathonApp: MarathonApp;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here
  project: String = null;

  constructor(
    private marathonAppService: MarathonAppService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.params.forEach((params: Params) => {
      let fullId = null;
      if (params['project'] !== undefined) {
        this.project = params['project'];
        fullId = params['project'];
        // this.getMarathonApps(this.project);
      } else {
        this.project = '';
        // this.getMarathonApps();
      }

      if (params['id'] !== undefined) {
        const id = params['id'];
        if ( fullId ) {
          fullId = '/' + fullId + '/' + id;
        } else {
          fullId = id;
        }
        this.navigated = true;
        this.marathonAppService.get(fullId).subscribe(
          marathonApp => {
            this.marathonApp = marathonApp;
          });
      } else {
        this.navigated = false;
        this.marathonApp = new MarathonApp();
      }
    });
  }

  save(): void {
    this.marathonAppService.save(this.marathonApp).subscribe(marathonApp => {
      this.marathonApp = marathonApp; // saved marathonApp, w/ id if new
      this.goBack(marathonApp);
    }, error => {
      this.error = error;
    }); // TODO: Display error message
  }

  goBack(savedMarathonApp: MarathonApp = null): void {
    this.close.emit(savedMarathonApp);
    if (this.navigated) {
      window.history.back();
    }
  }
}

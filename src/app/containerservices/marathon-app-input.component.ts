import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MarathonApp } from './marathon-app';
import { MarathonAppService } from './marathon-app.service';

@Component({
  selector: 'app-marathon-app-input',
  templateUrl: './marathon-app-input.component.html',
  styleUrls: ['./marathon-app-input.component.css']
})
export class MarathonAppInputComponent implements OnInit {
  @Input() project: String;
  @Input() marathonApp: MarathonApp;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private marathonAppService: MarathonAppService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        const id = params['id'];
        this.navigated = true;
        this.marathonAppService.get(id).subscribe(marathonApp => {
          this.marathonApp = marathonApp;
        });
      } else {
        this.navigated = false;
        this.marathonApp = new MarathonApp();
      }
      if (params['project'] !== undefined) {
        this.project = params['project'];
        this.marathonApp.project = this.project;
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

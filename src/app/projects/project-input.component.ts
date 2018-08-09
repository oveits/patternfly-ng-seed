import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Project } from './project';
import { ProjectService } from './project.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-project-input',
  templateUrl: './project-input.component.html',
  styleUrls: ['./project-input.component.css']
})
export class ProjectInputComponent implements OnInit {
  @Input() customer: String;
  @Input() project: Project;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        const id = params['id'];
        this.navigated = true;
        this.projectService.get(id).subscribe(project => {
          this.project = project;
        });
      } else {
        this.navigated = false;
        this.project = new Project();
      }
      if (params['customer'] !== undefined) {
        this.customer = params['customer'];
        this.project.customer = this.customer;
      }
    });
  }

  save(): void {
    this.projectService.save(this.project).subscribe(project => {
      this.project = project; // saved project, w/ id if new
      this.goBack(project);
    }, error => {
      this.error = error;
    }); // TODO: Display error message
  }

  goBack(savedProject: Project = null): void {
    this.close.emit(savedProject);
    if (this.navigated) {
      window.history.back();
    }
  }
}

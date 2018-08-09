import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { Project } from './project';
import { ProjectService } from './project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[];
  selectedProject: Project;
  addingProject = false;
  error: any;
  showNgFor = false;
  exposedUrl: String = '/projects';
  customer: String = null;

  constructor(private router: Router,
    private projectService: ProjectService,
    private route: ActivatedRoute) {}

  getProjects(myCustomer: String = null): void {
    this.projectService
      .getAll()
      .subscribe(
        projects => {
          this.projects = projects as Project[];
          if (myCustomer) {
            this.customer = myCustomer;
            this.projects = this.projects.filter(app => app.customer === myCustomer);
          }
          console.log(this.projects);
        }
        ,
        error => {
          console.log(error);
          this.error = error;
        }
      );
  }

  addProject(): void {
    this.addingProject = true;
    this.selectedProject = null;
  }

  close(savedProject: Project): void {
    this.addingProject = false;
    this.getProjects(this.customer);
  }

  deleteProject(project: Project, event: any): void {
    event.stopPropagation();
    this.projectService.delete(project).subscribe(res => {
      this.projects = this.projects.filter(h => h !== project);
      if (this.selectedProject === project) {
        this.selectedProject = null;
      }
    }, error => (this.error = error));
  }

  ngOnInit(): void {
    // not needed, sind the Url is set in the Service, and is not part of the Project class:
    // this.projectService.setUrl((new Project).url);
    this.route.params.forEach((params: Params) => {
      if (params['customer'] !== undefined) {
        this.customer = params['customer'];
        this.getProjects(this.customer);
      } else {
        this.getProjects();
      }
    });
  }

  onSelect(project: Project): void {
    this.selectedProject = project;
    this.addingProject = false;
    this.router.navigate([this.exposedUrl, this.selectedProject.name, 'marathonapps']);
  }

  gotoDetail(): void {
    this.router.navigate([this.exposedUrl, this.selectedProject.id]);
  }
}

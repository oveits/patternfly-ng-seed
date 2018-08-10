import { RestItem } from '../common/rest-item';

export class MarathonApp extends RestItem {
    id: String;
    name: String;
    project: String;
    instances: Number;
    healthyness: number;
    url: String;

    // deployments: String;
    // configuredInstances: String;
    // tasksStaged: String;
    // tasksHealthy: String;
    // tasksUnhealthy: String;
    // tasksRunning: String;

  }

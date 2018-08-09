import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class ProjectInterceptor implements HttpInterceptor {
    private urlPattern = '.*marathon.*groups.*'
    // TODO: url is now defined in './project.service.ts' while the authToken is defined here
    //       Please Improve the configuration handling! 

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {


        // interceptor for marathon API only; i.e. NOOP for other URLs:
        if(!request.url.match(this.urlPattern)){
          return next.handle(request);
        }

        // TODO: if url is known, we also could do something like follows:
        // if(request.url !== this.url){
        //   return next.handle(request);
        // }

        if(request.method === 'POST' || request.method === 'PUT'){
            request = request.clone({
                body: this.requestBodyForCreatingItem(request.body)
            });
        }

        return next.handle(request).pipe(map(event =>{
          console.log("event");
          console.log(event);
          if (request.method === 'GET' && event instanceof HttpResponse) {
              console.log("Called Response Interceptor for GET");
              event = event.clone({ body: event.body['groups'].map(item => {
                var idArray = item.id.split("/");
                idArray.shift(); // remove leading empty element created because id starts with "/"
                var name = idArray.pop();
                var customer = idArray.join("/");

                return {
                  customer: customer,
                  name: name,
                  id: item.id,
                  instances: item.instances,
                  healthyness: item.tasksHealthy/item.instances
                };
              })});
            }        
            return event;
        }))

  }

  requestBodyForCreatingItem(item){
    // var id = item.id;
    var id = null;
    if (item.customer) {
      id = "/" + item.customer + "/" + item.name;
    } else {
      id = "/" + item.name;
    }

    return {
      "id": id,
      "backoffFactor": 1.15,
      "backoffSeconds": 1,
      "container": {
        "portMappings": [
          {
            "containerPort": 80,
            "hostPort": 0,
            "labels": {
            },
            "protocol": "tcp",
            "servicePort": 80
          }
        ],
        "type": "DOCKER",
        "volumes": [],
        "docker": {
          "image": "nginxdemos/hello",
          "forcePullImage": false,
          "privileged": false,
          "parameters": []
        }
      },
      "cpus": 0.1,
      "disk": 0,
      "healthChecks": [
        {
          "gracePeriodSeconds": 15,
          "ignoreHttp1xx": false,
          "intervalSeconds": 3,
          "maxConsecutiveFailures": 2,
          "portIndex": 0,
          "timeoutSeconds": 2,
          "delaySeconds": 15,
          "protocol": "HTTP",
          "path": "/"
        }
      ],
      "instances": 1,
      "labels": {
        "HAPROXY_DEPLOYMENT_GROUP": "nginx-hostname",
        "HAPROXY_0_REDIRECT_TO_HTTPS": "false",
        "HAPROXY_GROUP": "external",
        "HAPROXY_DEPLOYMENT_ALT_PORT": "80",
        "HAPROXY_0_PATH": id,
        "HAPROXY_0_VHOST": "195.201.17.1"
      },
      "maxLaunchDelaySeconds": 3600,
      "mem": 100,
      "gpus": 0,
      "networks": [
        {
          "mode": "container/bridge"
        }
      ],
      "requirePorts": false,
      "upgradeStrategy": {
        "maximumOverCapacity": 1,
        "minimumHealthCapacity": 1
      },
      "killSelection": "YOUNGEST_FIRST",
      "unreachableStrategy": {
        "inactiveAfterSeconds": 0,
        "expungeAfterSeconds": 0
      },
      "fetch": [],
      "constraints": []
    };
  }
}
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
export class MarathonInterceptor implements HttpInterceptor {
    // tslint:disable-next-line:max-line-length
    private authToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6InNlY3JldCIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIzeUY1VE9TemRsSTQ1UTF4c3B4emVvR0JlOWZOeG05bSIsImVtYWlsIjoib2xpdmVyLnZlaXRzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJleHAiOjE1MzI0NTU0MjksImlhdCI6MTUzMjAyMzQyOSwiaXNzIjoiaHR0cHM6Ly9kY29zLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNjI1MzMxNzc0ODE4NzQ5MDc3NCIsInVpZCI6Im9saXZlci52ZWl0c0BnbWFpbC5jb20ifQ.WstsTi0DhOISRStnB8jiY8S1nal6mGHWCyA50C5VFTw';
    private urlPattern = '.*marathon.*'
    // TODO: url is now defined in './marathon-app.service.ts' while the authToken is defined here
    //       Please Improve the configuration handling!

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {


        // interceptor for marathon API only; i.e. NOOP for other URLs:
        if (!request.url.match(this.urlPattern)) {
          return next.handle(request);
        }

        // TODO: if url is known, we also could do something like follows:
        // if(request.url !== this.url){
        //   return next.handle(request);
        // }

        const authToken = this.authToken; // TODO: const authToken = this.auth.getAuthorizationToken();
        // const authReq = request.clone({
        //     headers: request.headers.set('Authorization', authToken)
        // });

        request = request.clone({
            headers: request.headers.set('Authorization', 'token=' + authToken)
        });
        request = request.clone({
            headers: request.headers.set('Content-Type', 'application/json')
        });

        return next.handle(request);
  }
}

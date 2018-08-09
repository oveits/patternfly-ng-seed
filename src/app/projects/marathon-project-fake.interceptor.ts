import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MarathonProjectFakeInterceptor implements HttpInterceptor {

    private msec = 5000;

    constructor() { }

    setHealthyAfterDelay(id, msec) {

        return timer(msec, id)
            .pipe(map((x) => {
            console.log(x);
            this.setHealthy(id);
            })).subscribe();
    }
    setHealthy(id) {
        const groups: any[] = JSON.parse(localStorage.getItem('groups')) || [];
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            if (group.id === id) {
                // delete group
                if ( !id.includes('broken')) {
                    group.tasksHealthy = group.instances;
                    groups[i] = group;
                    localStorage.setItem('groups', JSON.stringify(groups));
                }
                break;
            }
        }
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        const groups: any[] = JSON.parse(localStorage.getItem('groups')) || [];

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {


            // get users
            if (request.url.endsWith('/groups') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid,
                // this security is implemented server side in a real grouplication
                // if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: { 'groups': groups } }));
                // } else {
                //     // return 401 not authorised if token is null or invalid
                //     return throwError({ error: { message: 'Unauthorised' } });
                // }
            }

            // get group by id
            if (request.url.match(/\/groups\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid,
                // this security is implemented server side in a real grouplication
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    const urlParts = request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    const matchedUsers = groups.filter(groupsUser => groupsUser.id === id);
                    const user = matchedUsers.length ? matchedUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ error: { message: 'Unauthorised' } });
                }
            }

            // register group
            if (request.url.endsWith('/groups') && request.method === 'POST') {
                // get new user object from post body
                const newgroup = request.body;
                newgroup.tasksHealthy = 0;


                // validation
                const duplicategroup = groups.filter(group => group.id === newgroup.id).length;
                if (duplicategroup) {
                    return throwError({ error: { message: 'group "' + newgroup.id + '" is already taken' } });
                }


                // save new group
                // newgroup.id = groups.length + 1;
                const pointer = groups.push(newgroup);
                localStorage.setItem('groups', JSON.stringify(groups));

                this.setHealthyAfterDelay(newgroup.id, this.msec);

                // respond 200 OK
                return of(new HttpResponse({ status: 201 }));
            }

            // delete user
            if (request.url.match(/\/groups\//) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid,
                // this security is implemented server side in a real grouplication
                // if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    const urlParts = request.url.split('/groups/');
                    // let id = parseInt(urlParts[urlParts.length - 1]);
                    const id = urlParts[urlParts.length - 1];
                    for (let i = 0; i < groups.length; i++) {
                        const group = groups[i];
                        if (group.id === id) {
                            // delete group
                            groups.splice(i, 1);
                            localStorage.setItem('groups', JSON.stringify(groups));
                            break;
                        }
                    }

                    // respond 200 OK
                    return of(new HttpResponse({ status: 200 }));
                // } else {
                //     // return 401 not authorised if token is null or invalid
                //     return throwError({ error: { message: 'Unauthorised' } });
                // }
            }

            // pass through any requests not handled above
            return next.handle(request);

        }))

        // call materialize and dematerialize to ensure delay
        // even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let marathonProjectFakeProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MarathonProjectFakeInterceptor,
    multi: true
};

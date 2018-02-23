import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { JobAnswer, JobBody, Format, Type, JobStatus  } from "./revit-converter.models";

@Injectable()
export class RevitConverterService {

  errorMessage: string;
  private _baseUrl = 'https://developer.api.autodesk.com/modelderivative/v2/designdata/';

  constructor(private _http: HttpClient, private router: Router) {}

  public setDelay(): void {
    setTimeout(function() {
      // console.log(i);
    }, 1000);
  }

  public PostJobRequest(access_token: string, objectId: string): Observable<JobAnswer> {

    let body: string = '{"input": {"urn": "' + btoa(objectId).replace(/=+$/, "") + '"},"output": {"formats": [{"type": "ifc"}]}}'

    return this._http.post<JobAnswer>(
      this._baseUrl + 'job', body,
      {
        headers: new HttpHeaders()
          .set('Authorization', 'Bearer ' + access_token)
          .set('Content-Type', 'application/json')
      })
      .do(data => console.log('All PostJobRequest: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

   GetJobStatus(access_token: string, objectId: string): Observable<JobStatus> {
    return this._http.get<JobStatus>(
      this._baseUrl + btoa(objectId).replace(/=+$/, "") + '/manifest' ,
      {
        headers: new HttpHeaders()
          .set('Authorization', 'Bearer ' + access_token)
      })
      .do(data => console.log('All GetJobStatus: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.log(errorMessage);
    return Observable.throw(errorMessage);
  }

}
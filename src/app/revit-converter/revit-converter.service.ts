import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { JobAnswer, JobBody, Format, Type  } from "./revit-converter.models";

@Injectable()
export class RevitConverterService {

  errorMessage: string;
  private _baseUrl = 'https://developer.api.autodesk.com/modelderivative/v2/designdata/job';

  constructor(private _http: HttpClient, private router: Router) {}

  public PostJob(access_token: string, objectId: string) {

    let body: string = '{"input": {"urn": "' + btoa(objectId).replace(/=+$/, "") + '"},"output": {"formats": [{"type": "ifc"}]}}'
    this.PostJobRequest(access_token, body)
      .subscribe(answer => {
        console.log(answer);
      },
      error => this.errorMessage = <any>error);
  }

  private PostJobRequest(access_token: string, body: string): Observable<JobAnswer> {
    return this._http.post<JobAnswer>(
      this._baseUrl , body,
      {
        headers: new HttpHeaders()
          .set('Authorization', 'Bearer ' + access_token)
          .set('Content-Type', 'application/json')
      })
      .do(data => console.log('All PostJobRequest: ' + JSON.stringify(data)))
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

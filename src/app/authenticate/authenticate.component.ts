import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit {

  public client_id: string;
  public client_secret: string;
  public submitted: boolean;
  public token: string;
  public _baseURL: string = "https://developer.api.autodesk.com/authentication/v1/authenticate";

  constructor(private _http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log("submitted");
    //this.submitted = true;

    this.PostAuthenticate()
    .subscribe(authentication => {
      this.token = authentication.access_token;

      // look for a bucket

      // If none, create one and catch it name

    });
  }

  private PostAuthenticate(): Observable<any> {

    // let body: string = '{"input": {"urn": "' + btoa(objectId).replace(/=+$/, "") + '"},"output": {"formats": [{"type": "ifc"}]}}'
    let body: string =
    "client_id=" + this.client_id +
    "&client_secret=" + this.client_secret +
    "&grant_type=client_credentials" +
    "&scope=data:write viewables:read data:read bucket:read";

    return this._http.post<any>(
      this._baseURL, body,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })
      .do(data => console.log('Authentication answer: ' + JSON.stringify(data)))
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

export interface Authenticate {
  access_token: string;
  token_type: string;
  expires_in: number;
}

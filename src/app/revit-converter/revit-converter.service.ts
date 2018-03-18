import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams
} from "@angular/common/http";
import { Response, ResponseContentType, Jsonp } from '@angular/http';
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ISubscription } from "rxjs/Subscription";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";

import {
    JobAnswer,
    JobBody,
    Format,
    Type,
    JobStatus,
    AccessToken
} from "./revit-converter.models";

@Injectable()
export class RevitConverterService {
    errorMessage: string;
    private _baseUrl = "https://developer.api.autodesk.com/modelderivative/v2/designdata/";

    constructor(private _http: HttpClient, private router: Router) {}

    public setDelay(delay: number): void {
        setTimeout(function() {
            console.log(delay);
        }, delay);
    }

    public PostJobRequest(
        access_token: string,
        objectId: string
    ): Observable<JobAnswer> {
        let body: string =
            '{"input": {"urn": "' +
            btoa(objectId).replace(/=+$/, "") +
            '"},"output": {"formats": [{"type": "ifc"}]}}';

        return this._http
            .post<JobAnswer>(this._baseUrl + "job", body, {
                headers: new HttpHeaders()
                    .set("Authorization", "Bearer " + access_token)
                    .set("Content-Type", "application/json")
            })
            .do(data =>
                console.log("All PostJobRequest: " + JSON.stringify(data))
            )
            .catch(this.handleError);
    }

    public GetJobStatus(
        access_token: string,
        urn: string
    ): Observable<JobStatus> {
        return this._http
            .get<JobStatus>(this._baseUrl + urn + "/manifest", {
                headers: new HttpHeaders().set(
                    "Authorization",
                    "Bearer " + access_token
                )
            })
            .do(data =>
                console.log("All GetJobStatus: " + JSON.stringify(data))
            )
            .catch(this.handleError);
    }

    public GetDerivative(
        access_token: string,
        urn: string,
        derivative: string
    ): Observable<any> {
        return this._http
            .get<any>(this._baseUrl + urn + "/manifest/" + derivative, {
                headers: new HttpHeaders().set(
                    "Authorization",
                    "Bearer " + access_token,
                ),
                responseType: 'blob' as 'json'
            })
            // .subscribe(data => this.downloadFile(data))
            .catch(this.handleError);
    }

    public downloadFile(data: Response, fileName: string) {
        let blob = new Blob([data], { type: "text/csv" });
        // let url = window.URL.createObjectURL(blob);

        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    public GetAccessToken(): Observable<AccessToken> {
        return this._http
            .get<AccessToken>(
                "https://forgefunction.azurewebsites.net/api/ForgeToken",
                {}
            )
            .do(data =>
                console.log("All GetAcessToken: " + JSON.stringify(data))
            )
            .catch(this.handleError);
    }

    /**
     * ConvertConversionProgress
     */
    public ConvertConversionProgress(progress: string): number {
        let value: number = Number(progress.match(/^\d*/)) as number;
        return value;
    }

    DeleteBucket(access_token: string, bucketId: string): Observable<any> {
        return (
            this._http
                .delete<any>(
                    "https://developer.api.autodesk.com/oss/v2/buckets/" +
                        bucketId,
                    {
                        headers: new HttpHeaders().set(
                            "Authorization",
                            "Bearer " + access_token
                        )
                    }
                )
                // .do(data => console.log('All DeleteBucket: ' + JSON.stringify(data)))
                .catch(this.handleError)
        );
    }

    private handleError(err: HttpErrorResponse) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage = "";
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Server returned code: ${
                err.status
            }, error message is: ${err.message}`;
        }
        console.log(errorMessage);
        return Observable.throw(errorMessage);
    }
}

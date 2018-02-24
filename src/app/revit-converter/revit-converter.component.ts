import { Component, OnInit } from '@angular/core';
import { FileUploader, FileUploaderOptions, Headers, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { RevitConverterService } from "./revit-converter.service";
import { ConversionJob, UploadAnswer, FormDataStatus } from "./revit-converter.models";

const baseUrl = 'https://developer.api.autodesk.com/oss/v2/buckets/';

@Component({
  selector: 'app-revit-converter',
  templateUrl: './revit-converter.component.html',
  styleUrls: ['./revit-converter.component.scss'],
  providers: [RevitConverterService]
})
export class RevitConverterComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ disableMultipart: true });
  public uploaderOptions: FileUploaderOptions;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public access_token = "eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJlajhvbHFheEV0UHF1a2VhRlhYTXZBNjVqN2Zla1pBRyIsImV4cCI6MTUxOTQ4MzY4Niwic2NvcGUiOlsiZGF0YTp3cml0ZSIsInZpZXdhYmxlczpyZWFkIiwiZGF0YTpyZWFkIiwiYnVja2V0OnJlYWQiXSwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2p3dGV4cDYwIiwianRpIjoiNU9UbDVFYUZHWTM3ZUE0bVh1VnFrbGFXYzJLanFaazhjeUdTUXU4NmFPOE5HWEQxRkxieTJzRjh3d0RtMXdIMSJ9.4uk6g_1WUNEWgaEeMYog2pJwyPEnmEdBhRfdhA-IQTw";



  constructor(private _revitConverterService: RevitConverterService) { }

  ngOnInit() {
    this.uploader.onBeforeUploadItem = (item) => {
      item.method = "PUT";
      item.url = baseUrl + 'revittoifcbucket2/objects/' + item.file.name;

      let headers: Headers[] = [
        { name: "Authorization", value: "Bearer " + this.access_token },
        { name: "Content-Type", value: "application/octet-stream" }
      ];

      item.headers = headers;
    }

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log(response);
      let uploadResponse: UploadAnswer = JSON.parse(response);

      item.formData = "Uploaded";

      this._revitConverterService.PostJobRequest(this.access_token, uploadResponse.objectId)
        .subscribe(answer => {
          this._revitConverterService.GetJobStatus(this.access_token, answer.urn)
            .subscribe(jobStatus1 => {
              let itemStatus: FormDataStatus = {
                intervalId: null,
                status: jobStatus1.progress
              };
              item.formData = itemStatus;

              if (jobStatus1.progress !== "complete") {
                let interval = setInterval(this.UpdateJobStatus, 2000, this.access_token, answer.urn, this._revitConverterService, item);
                item.formData.intervalId = interval;
              }
            },
              error => this._revitConverterService.errorMessage = <any>error);
        },
          error => this._revitConverterService.errorMessage = <any>error);
    };
  }

  /**
 * UpdateJobStatus
 */
  public UpdateJobStatus(access_token: string, urn: string, service: RevitConverterService, item: FileItem): void {
    service.GetJobStatus(access_token, urn)
      .subscribe(jobCurrentStatus => {
        if (jobCurrentStatus.progress !== "complete") {
          item.formData.status = jobCurrentStatus.progress;
        } else {
          item.formData.status = "complete";
          clearInterval(item.formData.intervalId);
        }
      },
        error => this._revitConverterService.errorMessage = <any>error)
  }

  /**
   * DeleteBuckets
   */
  public DeleteBuckets() {
    let bucketsNames: string[] = [
      'bucketname'
    ];

    bucketsNames.forEach(bucketsName => {
      this._revitConverterService.DeleteBucket(this.access_token, bucketsName)
        .subscribe(response => {
          console.log(bucketsName + response);
        },
          error => this._revitConverterService.errorMessage = <any>error);
    });
  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}

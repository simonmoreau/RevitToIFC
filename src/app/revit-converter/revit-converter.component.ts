import { Component, OnInit } from '@angular/core';
import { FileUploader, FileUploaderOptions, Headers, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { RevitConverterService } from "./revit-converter.service";
import { ConversionJob, UploadAnswer } from "./revit-converter.models";

const baseUrl = 'https://developer.api.autodesk.com/oss/v2/buckets/';

@Component({
  selector: 'app-revit-converter',
  templateUrl: './revit-converter.component.html',
  styleUrls: ['./revit-converter.component.scss'],
  providers: [RevitConverterService]
})
export class RevitConverterComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({disableMultipart: true});
  public uploaderOptions: FileUploaderOptions;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public access_token = "eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJlajhvbHFheEV0UHF1a2VhRlhYTXZBNjVqN2Zla1pBRyIsImV4cCI6MTUxOTQyNzgyOSwic2NvcGUiOlsiZGF0YTp3cml0ZSIsInZpZXdhYmxlczpyZWFkIiwiYnVja2V0OnJlYWQiLCJkYXRhOnJlYWQiXSwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2p3dGV4cDYwIiwianRpIjoidW5veW9jV2lPdXJHVUR5aVRYQ1gwbXJneFZrMlNXM3Bpb3NEUkU3SXNHUHl0OVVRcE5KR0p4SW5BMDFOb3VFOSJ9.MfH_Q_hz8UoS5Wdp-fiEUf0i28BvZXLmJSynssM5njo";

  constructor(private _revitConverterService: RevitConverterService) { }

  ngOnInit() {


    this.uploader.onBeforeUploadItem = (item) => {
      item.method = "PUT";
      item.url = baseUrl + 'bim42_bucket_test/objects/' + item.file.name;

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
          this._revitConverterService.GetJobStatus(this.access_token, uploadResponse.objectId)
          .subscribe(jobStatus => {
            this._revitConverterService.GetJobStatus(this.access_token, uploadResponse.objectId)
            .subscribe(jobCurrentStatus => {
              do {
                this._revitConverterService.setDelay();
                item.formData = jobCurrentStatus.progress;
             } while (jobCurrentStatus.progress !== "complete")
            },
            error => this._revitConverterService.errorMessage = <any>error);
          },
          error => this._revitConverterService.errorMessage = <any>error);
        },
        error => this._revitConverterService.errorMessage = <any>error);
    };
  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}

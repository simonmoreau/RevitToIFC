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

  public uploader: FileUploader = new FileUploader({ isHTML5: true });
  public uploaderOptions: FileUploaderOptions;
  public conversionJobs: ConversionJob[] = [];
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public access_token = "eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJlajhvbHFheEV0UHF1a2VhRlhYTXZBNjVqN2Zla1pBRyIsImV4cCI6MTUxOTQyNDE3Miwic2NvcGUiOlsiZGF0YTp3cml0ZSIsInZpZXdhYmxlczpyZWFkIiwiYnVja2V0OnJlYWQiLCJkYXRhOnJlYWQiXSwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2p3dGV4cDYwIiwianRpIjoibVRRUnZ3c2NUVVU1R3REUHJIS0tXVUJmR1JGOXQwMjE5OFFYN0VXOTJWa3FsZWdBWGNtVFJEaFJyTGR4WjQ0VSJ9.owdQYZAf0ntGjwzTQNz23wGt2Crb4rE6k41d_u2Rlzk";


  constructor(private _revitConverterService: RevitConverterService) { }

  ngOnInit() {


    this.uploader.onBeforeUploadItem = (item) => {
      item.method = "PUT";
      item.url = baseUrl + 'bim42_bucket_test/objects/' + item.file.name;

      let headers: Headers[] = [
        { name: "Authorization", value: "Bearer " + this.access_token },
        { name: "Content-Type", value: "application/octet-stream" },
        { name: "Content-Length", value: item.file.size }
      ];

      item.headers = headers;
    }

    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log("ImageUpload:uploaded:", item, status, headers);
      console.log("");
      console.log(response);
      let uploadResponse: UploadAnswer;
      uploadResponse = JSON.parse(response);
      this.conversionJobs.filter(job => job.file.file === item.file)[0].uploadAnswer = uploadResponse;

      this._revitConverterService.PostJob(this.access_token, uploadResponse.objectId);
    };

    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      let conversionJob: ConversionJob = { uploadAnswer: null, file: fileItem, jobAnswer: null };
      this.conversionJobs.push(conversionJob);
    }

    this.uploader.onCancelItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {

      let index: number = this.conversionJobs.indexOf(this.conversionJobs.filter(job => job.file.file === item.file)[0]);
      if (index > -1) {
        this.conversionJobs.splice(index, 1);
      }
    }
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}

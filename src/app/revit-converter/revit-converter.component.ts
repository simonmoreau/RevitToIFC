import { Component, OnInit } from "@angular/core";
import {
    FileUploader,
    FileUploaderOptions,
    Headers,
    FileItem,
    ParsedResponseHeaders
} from "ng2-file-upload";
import { RevitConverterService } from "./revit-converter.service";
import {
    ConversionJob,
    UploadAnswer,
    FormDataStatus
} from "./revit-converter.models";

const baseUrl = "https://developer.api.autodesk.com/oss/v2/buckets/";

@Component({
    selector: "app-revit-converter",
    templateUrl: "./revit-converter.component.html",
    styleUrls: ["./revit-converter.component.scss"],
    providers: [RevitConverterService]
})
export class RevitConverterComponent implements OnInit {
    public uploader: FileUploader = new FileUploader({
        disableMultipart: true
    });
    public uploaderOptions: FileUploaderOptions;
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;
    public access_token = "";

    constructor(private _revitConverterService: RevitConverterService) {}

    ngOnInit() {
        // Fetch an access token

        this._revitConverterService.GetAccessToken().subscribe(token => {
            this.access_token = token.access_token;
            console.log(this.access_token);

            this.uploader.onBeforeUploadItem = item => {
                item.method = "PUT";
                item.url =
                    baseUrl + "revittoifcbucket/objects/" + Date.now().toString() + '_' + item.file.name;

                let headers: Headers[] = [
                    {
                        name: "Authorization",
                        value: "Bearer " + this.access_token
                    },
                    { name: "Content-Type", value: "application/octet-stream" }
                ];

                item.headers = headers;

                let itemStatus: FormDataStatus = {
                    intervalId: null,
                    status: "Uploading",
                    urn: "",
                    derivativeUrn: ""
                };
                item.formData = itemStatus;
            };

            this.uploader.onAfterAddingFile = (
                item: FileItem
            ) => {
                let extension: string = item.file.name.split('.').pop();
                if (extension !== "rvt") {
                    item.remove();
                }
            }

            this.uploader.onCompleteItem = (
                item: FileItem,
                response: string,
                status: number,
                headers: ParsedResponseHeaders
            ) => {
                console.log(response);
                let uploadResponse: UploadAnswer = JSON.parse(response);

                this._revitConverterService
                    .PostJobRequest(this.access_token, uploadResponse.objectId)
                    .subscribe(answer => {
                        this._revitConverterService
                            .GetJobStatus(this.access_token, answer.urn)
                            .subscribe(jobStatus1 => {
                                let itemStatus: FormDataStatus = {
                                    intervalId: null,
                                    status: "Converting",
                                    urn: answer.urn,
                                    derivativeUrn: ""
                                };
                                item.formData = itemStatus;

                                if (jobStatus1.progress !== "complete") {
                                    let interval = setInterval(
                                        this.UpdateJobStatus,
                                        2000,
                                        this.access_token,
                                        answer.urn,
                                        this._revitConverterService,
                                        item
                                    );
                                    item.formData.intervalId = interval;
                                } else {
                                    // When the conversion is complete
                                    if (jobStatus1.status === "failed") {
                                        itemStatus.status = "Failed";
                                    } else {
                                        itemStatus.status = "Complete";
                                        // Add the download link
                                        let derivativeUrn: string = jobStatus1.derivatives.filter(
                                            derivative =>
                                                derivative.outputType === "ifc"
                                        )[0].children[0].urn;
                                        itemStatus.derivativeUrn = derivativeUrn;
                                    }

                                }
                            }, error => (this._revitConverterService.errorMessage = <any>error));
                    }, error => (this._revitConverterService.errorMessage = <any>error));
            };
        }, error => (this._revitConverterService.errorMessage = <any>error));
    }

    /**
     * UpdateJobStatus
     */
    public UpdateJobStatus(
        access_token: string,
        urn: string,
        service: RevitConverterService,
        item: FileItem
    ): void {
        service.GetJobStatus(access_token, urn).subscribe(jobCurrentStatus => {
            let itemStatus: FormDataStatus = item.formData;

            if (jobCurrentStatus.progress !== "complete") {
                // While the job is running
                let conversionProgress: string = jobCurrentStatus.progress.match( new RegExp("\\d*%"))[0];
                itemStatus.status = "Converting " + conversionProgress; // ;
            } else {
                // When the conversion is complete
                itemStatus.status = "Complete";
                // Add the download link
                let derivativeUrn: string = jobCurrentStatus.derivatives.filter(
                    derivative => derivative.outputType === "ifc"
                )[0].children[0].urn;
                itemStatus.derivativeUrn = derivativeUrn;

                clearInterval(itemStatus.intervalId);
            }
        }, error => (this._revitConverterService.errorMessage = <any>error));
    }

    /**
     * Download file
     */
    public DownloadFile(urn: string, derivative: string) {
        let fileName: string = derivative.replace(/^.*[\\\/]/, '')
        fileName = fileName.replace( new RegExp("\\d*_"), "");
        this._revitConverterService
            .GetDerivative(this.access_token, urn, derivative)
            .subscribe(data => this._revitConverterService.downloadFile(data, fileName));
    }
    /**
     * DeleteBuckets
     */
    public DeleteBuckets() {
        let bucketsNames: string[] = ["bucketname"];

        bucketsNames.forEach(bucketsName => {
            this._revitConverterService
                .DeleteBucket(this.access_token, bucketsName)
                .subscribe(response => {
                    console.log(bucketsName + response);
                }, error => (this._revitConverterService.errorMessage = <any>error));
        });
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }
}

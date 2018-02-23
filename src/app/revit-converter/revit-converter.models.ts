import { FileItem } from 'ng2-file-upload';

export interface JobBody {
    input: Input;
    output: Output;
}

export interface Input {
    urn: string;
    compressedUrn: string;
    rootFilename: string;
}

export interface Output {
    formats: Format[];
    destination: Destination;
}

export interface Format {
    type: Type;
    views: string[];
}

export enum Destination {
    'US',
    'EMEA',
}

export enum Type {
    'DWG',
    'FBX',
    'IFC',
    'IGES',
    'OBJ',
    'STEP',
    'STL',
    'SVF',
    'thumbnail',
}

export interface AcceptedJobs {
    output: Output;
}

export interface JobAnswer {
    result: string;
    urn: string;
    acceptedJobs: AcceptedJobs;
}

export interface UploadAnswer {
    bucketKey: string;
    objectId: string;
    objectKey: string;
    sha1: string;
    size: number;
    contentType: string;
    location: string;
}

export interface ConversionJob {
    uploadAnswer: UploadAnswer;
    jobAnswer: JobAnswer;
    file: FileItem;
}



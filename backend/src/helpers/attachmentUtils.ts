import { CreateSignedURLRequest } from '../requests/CreateSignedUrlRequest';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);

export class NoteStorage {
    constructor(
        private readonly notesStorage = process.env.ATTACHMENT_S3_BUCKET,
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' })
    ) { }

    getBucketName() {
        return this.notesStorage;
    }

    getPresignedUploadURL(createSignedUrlRequest: CreateSignedURLRequest) {
        return this.s3.getSignedUrl('putObject', createSignedUrlRequest);
    }
}
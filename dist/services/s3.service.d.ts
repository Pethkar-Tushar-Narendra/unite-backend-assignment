export declare const getUploadUrlForLeadImage: (leadId: number, contentType: string) => Promise<{
    uploadUrl: string;
    key: string;
    fileUrl: string;
}>;
export declare const uploadCSVToS3: (fileBuffer: Buffer, filename: string) => Promise<string>;
export declare const downloadCSVFromS3: (key: string) => Promise<string>;
//# sourceMappingURL=s3.service.d.ts.map
export declare const sendToQueue: (message: any) => Promise<boolean>;
export declare const receiveFromQueue: () => Promise<import("@aws-sdk/client-sqs").Message[]>;
export declare const deleteFromQueue: (receiptHandle: string) => Promise<boolean>;
//# sourceMappingURL=sqs.service.d.ts.map
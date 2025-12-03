"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCSVWorker = void 0;
const sqs_service_1 = require("../services/sqs.service");
const s3_service_1 = require("../services/s3.service");
const csv_service_1 = require("../services/csv.service");
const startCSVWorker = async () => {
    console.log('🔄 CSV Worker started. Polling SQS for messages...');
    while (true) {
        try {
            const messages = await (0, sqs_service_1.receiveFromQueue)();
            for (const message of messages) {
                if (!message.Body || !message.ReceiptHandle)
                    continue;
                try {
                    const payload = JSON.parse(message.Body);
                    console.log(`📥 Processing CSV: ${payload.filename}`);
                    // Download CSV from S3
                    const csvData = await (0, s3_service_1.downloadCSVFromS3)(payload.s3Key);
                    // Process CSV
                    const result = await (0, csv_service_1.processCSVData)(csvData, payload.filename);
                    console.log(`✅ CSV processed: ${result.successCount} success, ${result.errorCount} errors`);
                    // Delete message from queue
                    await (0, sqs_service_1.deleteFromQueue)(message.ReceiptHandle);
                }
                catch (error) {
                    console.error('❌ Error processing message:', error);
                    // Message will be retried automatically by SQS
                }
            }
            // Wait 5 seconds before next poll
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        catch (error) {
            console.error('❌ Worker error:', error);
            await new Promise((resolve) => setTimeout(resolve, 10000));
        }
    }
};
exports.startCSVWorker = startCSVWorker;
//# sourceMappingURL=csvWorker.js.map
import { receiveFromQueue, deleteFromQueue } from '../services/sqs.service';
import { downloadCSVFromS3 } from '../services/s3.service';
import { processCSVData } from '../services/csv.service';

export const startCSVWorker = async () => {
  console.log('🔄 CSV Worker started. Polling SQS for messages...');

  while (true) {
    try {
      const messages = await receiveFromQueue();

      for (const message of messages) {
        if (!message.Body || !message.ReceiptHandle) continue;

        try {
          const payload = JSON.parse(message.Body);
          console.log(`📥 Processing CSV: ${payload.filename}`);

          // Download CSV from S3
          const csvData = await downloadCSVFromS3(payload.s3Key);

          // Process CSV
          const result = await processCSVData(csvData, payload.filename);

          console.log(
            `✅ CSV processed: ${result.successCount} success, ${result.errorCount} errors`,
          );

          // Delete message from queue
          await deleteFromQueue(message.ReceiptHandle);
        } catch (error) {
          console.error('❌ Error processing message:', error);
          // Message will be retried automatically by SQS
        }
      }

      // Wait 5 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error('❌ Worker error:', error);
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
};

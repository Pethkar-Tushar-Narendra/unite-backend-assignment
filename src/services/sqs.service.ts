import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';

dotenv.config();

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const QUEUE_URL = process.env.SQS_QUEUE_URL as string;

export const sendToQueue = async (message: any): Promise<boolean> => {
  try {
    const command = new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(message),
    });

    const response = await sqsClient.send(command);
    console.log(`✅ Message sent to SQS: ${response.MessageId}`);
    return true;
  } catch (error) {
    console.error('❌ SQS send error:', error);
    return false;
  }
};

export const receiveFromQueue = async () => {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    });

    const response = await sqsClient.send(command);
    return response.Messages || [];
  } catch (error) {
    console.error('❌ SQS receive error:', error);
    return [];
  }
};

export const deleteFromQueue = async (
  receiptHandle: string,
): Promise<boolean> => {
  try {
    const command = new DeleteMessageCommand({
      QueueUrl: QUEUE_URL,
      ReceiptHandle: receiptHandle,
    });

    await sqsClient.send(command);
    console.log('✅ Message deleted from SQS');
    return true;
  } catch (error) {
    console.error('❌ SQS delete error:', error);
    return false;
  }
};

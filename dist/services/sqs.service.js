"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromQueue = exports.receiveFromQueue = exports.sendToQueue = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sqsClient = new client_sqs_1.SQSClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const QUEUE_URL = process.env.SQS_QUEUE_URL;
const sendToQueue = async (message) => {
    try {
        const command = new client_sqs_1.SendMessageCommand({
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(message),
        });
        const response = await sqsClient.send(command);
        console.log(`✅ Message sent to SQS: ${response.MessageId}`);
        return true;
    }
    catch (error) {
        console.error('❌ SQS send error:', error);
        return false;
    }
};
exports.sendToQueue = sendToQueue;
const receiveFromQueue = async () => {
    try {
        const command = new client_sqs_1.ReceiveMessageCommand({
            QueueUrl: QUEUE_URL,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20,
        });
        const response = await sqsClient.send(command);
        return response.Messages || [];
    }
    catch (error) {
        console.error('❌ SQS receive error:', error);
        return [];
    }
};
exports.receiveFromQueue = receiveFromQueue;
const deleteFromQueue = async (receiptHandle) => {
    try {
        const command = new client_sqs_1.DeleteMessageCommand({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: receiptHandle,
        });
        await sqsClient.send(command);
        console.log('✅ Message deleted from SQS');
        return true;
    }
    catch (error) {
        console.error('❌ SQS delete error:', error);
        return false;
    }
};
exports.deleteFromQueue = deleteFromQueue;
//# sourceMappingURL=sqs.service.js.map
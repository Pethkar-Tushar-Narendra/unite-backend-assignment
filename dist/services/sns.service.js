"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSNSNotification = void 0;
const client_sns_1 = require("@aws-sdk/client-sns");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const snsClient = new client_sns_1.SNSClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const sendSNSNotification = async (message, subject) => {
    try {
        const command = new client_sns_1.PublishCommand({
            TopicArn: process.env.SNS_TOPIC_ARN,
            Message: message,
            Subject: subject,
        });
        const response = await snsClient.send(command);
        console.log(`✅ SNS notification sent: ${response.MessageId}`);
        return true;
    }
    catch (error) {
        console.error('❌ SNS error:', error);
        return false;
    }
};
exports.sendSNSNotification = sendSNSNotification;
//# sourceMappingURL=sns.service.js.map
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import dotenv from 'dotenv';

dotenv.config();

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const sendSNSNotification = async (
  message: string,
  subject: string,
): Promise<boolean> => {
  try {
    const command = new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: message,
      Subject: subject,
    });

    const response = await snsClient.send(command);
    console.log(`✅ SNS notification sent: ${response.MessageId}`);
    return true;
  } catch (error) {
    console.error('❌ SNS error:', error);
    return false;
  }
};

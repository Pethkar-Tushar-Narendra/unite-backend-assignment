import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export const sendSMS = async (
  to: string,
  message: string,
): Promise<boolean> => {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '',
      to: to || '',
    });

    console.log(`✅ Twilio SMS sent: ${result.sid}`);
    return true;
  } catch (error) {
    console.error('❌ Twilio error:', error);
    return false;
  }
};

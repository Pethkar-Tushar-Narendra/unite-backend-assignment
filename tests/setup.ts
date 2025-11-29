import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// Mock external services
jest.mock('../src/services/sns.service', () => ({
  sendSNSNotification: jest.fn().mockResolvedValue(true),
}));

jest.mock('../src/services/twilio.service', () => ({
  sendSMS: jest.fn().mockResolvedValue(true),
}));

jest.mock('../src/services/sqs.service', () => ({
  sendToQueue: jest.fn().mockResolvedValue(true),
  receiveFromQueue: jest.fn().mockResolvedValue([]),
  deleteFromQueue: jest.fn().mockResolvedValue(true),
}));

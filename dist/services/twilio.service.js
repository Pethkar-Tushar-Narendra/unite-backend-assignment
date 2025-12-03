"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendSMS = async (to, message) => {
    try {
        const result = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER || '',
            to: to || '',
        });
        console.log(`✅ Twilio SMS sent: ${result.sid}`);
        return true;
    }
    catch (error) {
        console.error('❌ Twilio error:', error);
        return false;
    }
};
exports.sendSMS = sendSMS;
//# sourceMappingURL=twilio.service.js.map
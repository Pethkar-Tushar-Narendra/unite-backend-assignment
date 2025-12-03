"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Define options with explicit type
const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    },
};
// Only add password if it exists in environment variables
if (process.env.REDIS_PASSWORD) {
    redisOptions.password = process.env.REDIS_PASSWORD;
}
const redisClient = new ioredis_1.default(redisOptions);
redisClient.on('connect', () => {
    console.log('✅ Redis Connected Successfully');
});
redisClient.on('error', (err) => {
    console.error('❌ Redis Connection Error:', err);
});
exports.default = redisClient;
//# sourceMappingURL=redis.js.map
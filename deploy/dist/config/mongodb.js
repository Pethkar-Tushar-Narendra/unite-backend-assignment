"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectMongoDB = async () => {
    // Only connect if MONGO_URI is explicitly set
    if (!process.env.MONGO_URI) {
        console.log('⚠️  MongoDB URI not provided, skipping MongoDB connection');
        return;
    }
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/unite_mongo';
        await mongoose_1.default.connect(mongoURI); // No options needed for Mongoose 6+
        console.log('✅ MongoDB Connected Successfully');
    }
    catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};
exports.default = connectMongoDB;
//# sourceMappingURL=mongodb.js.map
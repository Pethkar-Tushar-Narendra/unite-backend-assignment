"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCSVLogs = exports.uploadCSV = exports.uploadCSVMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const s3_service_1 = require("../services/s3.service");
const sqs_service_1 = require("../services/sqs.service");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
exports.uploadCSVMiddleware = upload.single('file');
const uploadCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { originalname, buffer } = req.file;
        // Upload to S3
        const s3Key = await (0, s3_service_1.uploadCSVToS3)(buffer, originalname);
        // Send to SQS for async processing
        await (0, sqs_service_1.sendToQueue)({
            s3Key,
            filename: originalname,
            uploadedBy: req.user?.id,
            uploadedAt: new Date().toISOString(),
        });
        res.status(202).json({
            message: 'CSV uploaded successfully. Processing in background.',
            s3Key,
        });
    }
    catch (error) {
        console.error('CSV upload error:', error);
        res
            .status(500)
            .json({ message: 'CSV upload failed', error: error.message });
    }
};
exports.uploadCSV = uploadCSV;
const getCSVLogs = async (req, res) => {
    try {
        const { CSVLog } = await Promise.resolve().then(() => __importStar(require('../services/csv.service')));
        const logs = await CSVLog.find().sort({ uploadedAt: -1 }).limit(20);
        res.json({ logs });
    }
    catch (error) {
        console.error('Error fetching CSV logs:', error);
        res
            .status(500)
            .json({ message: 'Error fetching logs', error: error.message });
    }
};
exports.getCSVLogs = getCSVLogs;
//# sourceMappingURL=csv.controller.js.map
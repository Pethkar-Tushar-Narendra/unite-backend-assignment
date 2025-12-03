"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCSVFromS3 = exports.uploadCSVToS3 = exports.getUploadUrlForLeadImage = void 0;
// src/services/s3.service.ts
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
const client_s3_1 = require("@aws-sdk/client-s3");
dotenv_1.default.config();
const region = process.env.AWS_REGION || 'us-east-1';
const bucketName = process.env.S3_BUCKET;
// Reuse one S3 client
const s3Client = new client_s3_1.S3Client({
    region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// Allowed image mime types
const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
];
const getUploadUrlForLeadImage = async (leadId, contentType) => {
    if (!bucketName) {
        throw new Error('S3_BUCKET is not configured');
    }
    if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
        throw new Error('Invalid image content type');
    }
    // Generate a unique key for the image
    const extension = contentType.split('/')[1]; // e.g. jpeg, png
    const key = `leads/${leadId}/${Date.now()}.${extension}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
        // Optional: make it publicly readable after upload
        // ACL: 'public-read',
    });
    // Pre-signed URL valid for 10 minutes
    const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 600 }); // 600 seconds [web:293][web:297]
    // Useful to store this URL/key in DB later
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    return { uploadUrl, key, fileUrl };
};
exports.getUploadUrlForLeadImage = getUploadUrlForLeadImage;
const uploadCSVToS3 = async (fileBuffer, filename) => {
    const region = process.env.AWS_REGION || 'us-east-1';
    const bucketName = process.env.S3_BUCKET;
    const key = `csv-uploads/${Date.now()}-${filename}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: 'text/csv',
    });
    await s3Client.send(command);
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    console.log(`✅ CSV uploaded to S3: ${fileUrl}`);
    return key;
};
exports.uploadCSVToS3 = uploadCSVToS3;
const downloadCSVFromS3 = async (key) => {
    const bucketName = process.env.S3_BUCKET;
    const command = new client_s3_1.GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    const response = await s3Client.send(command);
    const csvData = await response.Body?.transformToString();
    return csvData || '';
};
exports.downloadCSVFromS3 = downloadCSVFromS3;
//# sourceMappingURL=s3.service.js.map
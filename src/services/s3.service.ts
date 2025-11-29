// src/services/s3.service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const region = process.env.AWS_REGION || 'us-east-1';
const bucketName = process.env.S3_BUCKET as string;

// Reuse one S3 client
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Allowed image mime types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const getUploadUrlForLeadImage = async (
  leadId: number,
  contentType: string,
) => {
  if (!bucketName) {
    throw new Error('S3_BUCKET is not configured');
  }

  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    throw new Error('Invalid image content type');
  }

  // Generate a unique key for the image
  const extension = contentType.split('/')[1]; // e.g. jpeg, png
  const key = `leads/${leadId}/${Date.now()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    // Optional: make it publicly readable after upload
    // ACL: 'public-read',
  });

  // Pre-signed URL valid for 10 minutes
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // 600 seconds [web:293][web:297]

  // Useful to store this URL/key in DB later
  const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, key, fileUrl };
};

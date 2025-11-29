import { Response } from 'express';
import multer from 'multer';
import { AuthRequest } from '../middlewares/auth.middleware';
import { uploadCSVToS3 } from '../services/s3.service';
import { sendToQueue } from '../services/sqs.service';

const upload = multer({ storage: multer.memoryStorage() });

export const uploadCSVMiddleware = upload.single('file');

export const uploadCSV = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer } = req.file;

    // Upload to S3
    const s3Key = await uploadCSVToS3(buffer, originalname);

    // Send to SQS for async processing
    await sendToQueue({
      s3Key,
      filename: originalname,
      uploadedBy: req.user?.id,
      uploadedAt: new Date().toISOString(),
    });

    res.status(202).json({
      message: 'CSV uploaded successfully. Processing in background.',
      s3Key,
    });
  } catch (error: any) {
    console.error('CSV upload error:', error);
    res
      .status(500)
      .json({ message: 'CSV upload failed', error: error.message });
  }
};

export const getCSVLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { CSVLog } = await import('../services/csv.service');
    const logs = await CSVLog.find().sort({ uploadedAt: -1 }).limit(20);
    res.json({ logs });
  } catch (error: any) {
    console.error('Error fetching CSV logs:', error);
    res
      .status(500)
      .json({ message: 'Error fetching logs', error: error.message });
  }
};

// src/controllers/leadUpload.controller.ts
import { Request, Response } from 'express';
import { getUploadUrlForLeadImage } from '../services/s3.service';

export const getLeadImageUploadUrl = async (req: Request, res: Response) => {
  try {
    const { leadId, contentType } = req.body;

    if (!leadId || !contentType) {
      return res
        .status(400)
        .json({ message: 'leadId and contentType are required' });
    }

    const { uploadUrl, key, fileUrl } = await getUploadUrlForLeadImage(
      Number(leadId),
      contentType,
    );

    res.json({
      uploadUrl,
      key,
      fileUrl,
      expiresIn: 600,
    });
  } catch (error: any) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({
      message: 'Error generating S3 upload URL',
      error: error.message || String(error),
    });
  }
};

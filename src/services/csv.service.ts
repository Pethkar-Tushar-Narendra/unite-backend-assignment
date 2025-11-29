import csv from 'csv-parser';
import { Readable } from 'stream';
import Lead from '../models/lead.model';
import mongoose from 'mongoose';
import { Op } from 'sequelize';

interface CSVRow {
  name: string;
  phone: string;
  email: string;
  status?: string;
  source: string;
}

interface ProcessingResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ row: number; data: CSVRow; error: string }>;
}

// MongoDB schema for processing logs
const csvLogSchema = new mongoose.Schema({
  filename: String,
  uploadedAt: Date,
  totalRows: Number,
  successCount: Number,
  errorCount: Number,
  errors: [
    {
      row: Number,
      data: Object,
      error: String,
    },
  ],
  processedAt: Date,
});

export const CSVLog = mongoose.model('CSVLog', csvLogSchema);

export const processCSVData = async (
  csvData: string,
  filename: string,
): Promise<ProcessingResult> => {
  const results: CSVRow[] = [];
  const errors: Array<{ row: number; data: CSVRow; error: string }> = [];
  let rowNumber = 0;

  return new Promise((resolve, reject) => {
    const stream = Readable.from(csvData);

    stream
      .pipe(csv())
      .on('data', (data: CSVRow) => {
        rowNumber++;
        results.push({ ...data, rowNumber } as any);
      })
      .on('end', async () => {
        let successCount = 0;

        for (const row of results) {
          try {
            // Validation
            if (!row.name || !row.phone || !row.email || !row.source) {
              throw new Error('Missing required fields');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(row.email)) {
              throw new Error('Invalid email format');
            }

            // Check for duplicates
            const existing = await Lead.findOne({
              where: {
                [Op.or as any]: [{ email: row.email }, { phone: row.phone }],
              },
            });

            if (existing) {
              throw new Error('Duplicate lead (email or phone exists)');
            }

            // Create lead
            await Lead.create({
              name: row.name,
              phone: row.phone,
              email: row.email,
              status: (row.status as any) || 'new',
              source: row.source,
            });

            successCount++;
          } catch (error: any) {
            errors.push({
              row: (row as any).rowNumber,
              data: row,
              error: error.message,
            });
          }
        }

        const result: ProcessingResult = {
          totalRows: results.length,
          successCount,
          errorCount: errors.length,
          errors,
        };

        // Log to MongoDB
        await CSVLog.create({
          filename,
          uploadedAt: new Date(),
          totalRows: result.totalRows,
          successCount: result.successCount,
          errorCount: result.errorCount,
          errors: result.errors,
          processedAt: new Date(),
        });

        console.log(
          `✅ CSV processed: ${successCount}/${results.length} successful`,
        );
        resolve(result);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

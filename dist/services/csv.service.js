"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCSVData = exports.CSVLog = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const lead_model_1 = __importDefault(require("../models/lead.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const sequelize_1 = require("sequelize");
// MongoDB schema for processing logs
const csvLogSchema = new mongoose_1.default.Schema({
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
exports.CSVLog = mongoose_1.default.model('CSVLog', csvLogSchema);
const processCSVData = async (csvData, filename) => {
    const results = [];
    const errors = [];
    let rowNumber = 0;
    return new Promise((resolve, reject) => {
        const stream = stream_1.Readable.from(csvData);
        stream
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => {
            rowNumber++;
            results.push({ ...data, rowNumber });
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
                    const existing = await lead_model_1.default.findOne({
                        where: {
                            [sequelize_1.Op.or]: [{ email: row.email }, { phone: row.phone }],
                        },
                    });
                    if (existing) {
                        throw new Error('Duplicate lead (email or phone exists)');
                    }
                    // Create lead
                    await lead_model_1.default.create({
                        name: row.name,
                        phone: row.phone,
                        email: row.email,
                        status: row.status || 'new',
                        source: row.source,
                    });
                    successCount++;
                }
                catch (error) {
                    errors.push({
                        row: row.rowNumber,
                        data: row,
                        error: error.message,
                    });
                }
            }
            const result = {
                totalRows: results.length,
                successCount,
                errorCount: errors.length,
                errors,
            };
            // Log to MongoDB
            await exports.CSVLog.create({
                filename,
                uploadedAt: new Date(),
                totalRows: result.totalRows,
                successCount: result.successCount,
                errorCount: result.errorCount,
                errors: result.errors,
                processedAt: new Date(),
            });
            console.log(`✅ CSV processed: ${successCount}/${results.length} successful`);
            resolve(result);
        })
            .on('error', (error) => {
            reject(error);
        });
    });
};
exports.processCSVData = processCSVData;
//# sourceMappingURL=csv.service.js.map
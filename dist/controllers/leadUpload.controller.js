"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadImageUploadUrl = void 0;
const s3_service_1 = require("../services/s3.service");
const getLeadImageUploadUrl = async (req, res) => {
    try {
        const { leadId, contentType } = req.body;
        if (!leadId || !contentType) {
            return res
                .status(400)
                .json({ message: 'leadId and contentType are required' });
        }
        const { uploadUrl, key, fileUrl } = await (0, s3_service_1.getUploadUrlForLeadImage)(Number(leadId), contentType);
        res.json({
            uploadUrl,
            key,
            fileUrl,
            expiresIn: 600,
        });
    }
    catch (error) {
        console.error('Error generating upload URL:', error);
        res.status(500).json({
            message: 'Error generating S3 upload URL',
            error: error.message || String(error),
        });
    }
};
exports.getLeadImageUploadUrl = getLeadImageUploadUrl;
//# sourceMappingURL=leadUpload.controller.js.map
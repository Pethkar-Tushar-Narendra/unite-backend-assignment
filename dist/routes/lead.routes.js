"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lead_controller_1 = require("../controllers/lead.controller");
const lead_validator_1 = require("../validators/lead.validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const leadUpload_controller_1 = require("../controllers/leadUpload.controller");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticateJWT);
// POST /leads - Create new lead
router.post('/', lead_validator_1.validateCreateLead, lead_controller_1.createLead);
// GET /leads - Get all leads
router.get('/', lead_controller_1.getAllLeads);
// GET /leads/:id - Get single lead
router.get('/:id', lead_controller_1.getLeadById);
// PUT /leads/:id - Update lead
router.put('/:id', lead_validator_1.validateUpdateLead, lead_controller_1.updateLead);
// DELETE /leads/:id - Delete lead
router.delete('/:id', lead_controller_1.deleteLead);
// get pre‑signed upload URL for lead image
router.post('/upload-url', leadUpload_controller_1.getLeadImageUploadUrl);
exports.default = router;
//# sourceMappingURL=lead.routes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.updateLead = exports.getLeadById = exports.getAllLeads = exports.createLead = void 0;
const lead_model_1 = __importDefault(require("../models/lead.model"));
const lead_validator_1 = require("../validators/lead.validator");
const express_validator_1 = require("express-validator");
// Create new lead with duplicate prevention
const createLead = async (req, res) => {
    try {
        // Check express-validator errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Validate with Joi
        const { error, value } = lead_validator_1.createLeadSchemaJoi.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0]?.message });
        }
        // Check for duplicate email
        const existingEmail = await lead_model_1.default.findOne({ where: { email: value.email } });
        if (existingEmail) {
            return res
                .status(409)
                .json({ message: 'Lead with this email already exists' });
        }
        // Check for duplicate phone
        const existingPhone = await lead_model_1.default.findOne({ where: { phone: value.phone } });
        if (existingPhone) {
            return res
                .status(409)
                .json({ message: 'Lead with this phone number already exists' });
        }
        // Create lead
        const lead = await lead_model_1.default.create(value);
        res.status(201).json({
            message: 'Lead created successfully',
            lead,
        });
    }
    catch (error) {
        console.error('Create Lead Error:', error);
        // Handle Sequelize unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                message: 'Duplicate entry detected',
                field: error.errors[0]?.path,
            });
        }
        res.status(500).json({
            message: 'Error creating lead',
            error: error.message,
        });
    }
};
exports.createLead = createLead;
// Get all leads
const getAllLeads = async (req, res) => {
    try {
        const leads = await lead_model_1.default.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.json({ leads });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Error fetching leads', error: error.message });
    }
};
exports.getAllLeads = getAllLeads;
// Get single lead
const getLeadById = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await lead_model_1.default.findByPk(id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json({ lead });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Error fetching lead', error: error.message });
    }
};
exports.getLeadById = getLeadById;
// Update lead
const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        // Check express-validator errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Validate with Joi
        const { error, value } = lead_validator_1.updateLeadSchemaJoi.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0]?.message });
        }
        const lead = await lead_model_1.default.findByPk(id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        // Check for duplicate email (if email is being updated)
        if (value.email && value.email !== lead.email) {
            const existingEmail = await lead_model_1.default.findOne({
                where: { email: value.email },
            });
            if (existingEmail) {
                return res
                    .status(409)
                    .json({ message: 'Lead with this email already exists' });
            }
        }
        // Check for duplicate phone (if phone is being updated)
        if (value.phone && value.phone !== lead.phone) {
            const existingPhone = await lead_model_1.default.findOne({
                where: { phone: value.phone },
            });
            if (existingPhone) {
                return res
                    .status(409)
                    .json({ message: 'Lead with this phone number already exists' });
            }
        }
        await lead.update(value);
        res.json({ message: 'Lead updated successfully', lead });
    }
    catch (error) {
        console.error('Update Lead Error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                message: 'Duplicate entry detected',
                field: error.errors[0]?.path,
            });
        }
        res
            .status(500)
            .json({ message: 'Error updating lead', error: error.message });
    }
};
exports.updateLead = updateLead;
// Delete lead
const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await lead_model_1.default.findByPk(id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        await lead.destroy();
        res.json({ message: 'Lead deleted successfully' });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Error deleting lead', error: error.message });
    }
};
exports.deleteLead = deleteLead;
//# sourceMappingURL=lead.controller.js.map
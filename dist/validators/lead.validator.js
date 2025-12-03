"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateLead = exports.validateCreateLead = exports.updateLeadSchemaJoi = exports.createLeadSchemaJoi = void 0;
const joi_1 = __importDefault(require("joi"));
const express_validator_1 = require("express-validator");
// Joi schema for lead creation
exports.createLeadSchemaJoi = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must not exceed 100 characters',
    }),
    phone: joi_1.default.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .required()
        .messages({
        'string.empty': 'Phone is required',
        'string.pattern.base': 'Invalid phone number format',
    }),
    email: joi_1.default.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
    }),
    status: joi_1.default.string()
        .valid('new', 'contacted', 'qualified', 'converted', 'lost')
        .default('new'),
    source: joi_1.default.string().min(2).max(50).required().messages({
        'string.empty': 'Source is required',
        'string.min': 'Source must be at least 2 characters',
    }),
    assigned_to: joi_1.default.number().integer().optional().allow(null),
});
// Joi schema for lead update
exports.updateLeadSchemaJoi = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    phone: joi_1.default.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .optional(),
    email: joi_1.default.string().email().optional(),
    status: joi_1.default.string()
        .valid('new', 'contacted', 'qualified', 'converted', 'lost')
        .optional(),
    source: joi_1.default.string().min(2).max(50).optional(),
    assigned_to: joi_1.default.number().integer().optional().allow(null),
});
// Express-validator chains for lead creation
exports.validateCreateLead = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('phone')
        .notEmpty()
        .withMessage('Phone is required')
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Invalid phone number format')
        .trim(),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['new', 'contacted', 'qualified', 'converted', 'lost'])
        .withMessage('Invalid status value'),
    (0, express_validator_1.body)('source')
        .notEmpty()
        .withMessage('Source is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Source must be between 2 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('assigned_to')
        .optional({ nullable: true })
        .isInt()
        .withMessage('Assigned_to must be a valid user ID'),
];
// Express-validator chains for lead update
exports.validateUpdateLead = [
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('phone')
        .optional()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Invalid phone number format')
        .trim(),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['new', 'contacted', 'qualified', 'converted', 'lost'])
        .withMessage('Invalid status value'),
    (0, express_validator_1.body)('source')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Source must be between 2 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('assigned_to')
        .optional({ nullable: true })
        .isInt()
        .withMessage('Assigned_to must be a valid user ID'),
];
//# sourceMappingURL=lead.validator.js.map
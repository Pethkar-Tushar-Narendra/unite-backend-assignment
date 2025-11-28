import Joi from 'joi';
import { body, ValidationChain } from 'express-validator';

// Joi schema for lead creation
export const createLeadSchemaJoi = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 100 characters',
  }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .required()
    .messages({
      'string.empty': 'Phone is required',
      'string.pattern.base': 'Invalid phone number format',
    }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
  }),
  status: Joi.string()
    .valid('new', 'contacted', 'qualified', 'converted', 'lost')
    .default('new'),
  source: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Source is required',
    'string.min': 'Source must be at least 2 characters',
  }),
  assigned_to: Joi.number().integer().optional().allow(null),
});

// Joi schema for lead update
export const updateLeadSchemaJoi = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional(),
  email: Joi.string().email().optional(),
  status: Joi.string()
    .valid('new', 'contacted', 'qualified', 'converted', 'lost')
    .optional(),
  source: Joi.string().min(2).max(50).optional(),
  assigned_to: Joi.number().integer().optional().allow(null),
});

// Express-validator chains for lead creation
export const validateCreateLead: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  body('phone')
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'converted', 'lost'])
    .withMessage('Invalid status value'),
  body('source')
    .notEmpty()
    .withMessage('Source is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Source must be between 2 and 50 characters')
    .trim(),
  body('assigned_to')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Assigned_to must be a valid user ID'),
];

// Express-validator chains for lead update
export const validateUpdateLead: ValidationChain[] = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'converted', 'lost'])
    .withMessage('Invalid status value'),
  body('source')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Source must be between 2 and 50 characters')
    .trim(),
  body('assigned_to')
    .optional({ nullable: true })
    .isInt()
    .withMessage('Assigned_to must be a valid user ID'),
];

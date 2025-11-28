import { Request, Response } from 'express';
import Lead from '../models/lead.model';
import {
  createLeadSchemaJoi,
  updateLeadSchemaJoi,
} from '../validators/lead.validator';
import { validationResult } from 'express-validator';

// Create new lead with duplicate prevention
export const createLead = async (req: Request, res: Response) => {
  try {
    // Check express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate with Joi
    const { error, value } = createLeadSchemaJoi.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0]?.message });
    }

    // Check for duplicate email
    const existingEmail = await Lead.findOne({ where: { email: value.email } });
    if (existingEmail) {
      return res
        .status(409)
        .json({ message: 'Lead with this email already exists' });
    }

    // Check for duplicate phone
    const existingPhone = await Lead.findOne({ where: { phone: value.phone } });
    if (existingPhone) {
      return res
        .status(409)
        .json({ message: 'Lead with this phone number already exists' });
    }

    // Create lead
    const lead = await Lead.create(value);
    res.status(201).json({
      message: 'Lead created successfully',
      lead,
    });
  } catch (error: any) {
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

// Get all leads
export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({ leads });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error fetching leads', error: error.message });
  }
};

// Get single lead
export const getLeadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ lead });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error fetching lead', error: error.message });
  }
};

// Update lead
export const updateLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate with Joi
    const { error, value } = updateLeadSchemaJoi.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0]?.message });
    }

    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check for duplicate email (if email is being updated)
    if (value.email && value.email !== lead.email) {
      const existingEmail = await Lead.findOne({
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
      const existingPhone = await Lead.findOne({
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
  } catch (error: any) {
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

// Delete lead
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.destroy();
    res.json({ message: 'Lead deleted successfully' });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error deleting lead', error: error.message });
  }
};

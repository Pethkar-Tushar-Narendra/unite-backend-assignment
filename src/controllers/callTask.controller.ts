import { Request, Response } from 'express';
import CallTask from '../models/callTask.model';
import { sendSNSNotification } from '../services/sns.service';
import { sendSMS } from '../services/twilio.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CallLog } from '../models/callLog.model';
import User from '../models/user.model';

export const createCallTask = async (req: AuthRequest, res: Response) => {
  try {
    const { lead_id, assigned_to, scheduled_at, idempotency_key } = req.body;

    // Idempotency check
    if (idempotency_key) {
      const existing = await CallTask.findOne({ where: { idempotency_key } });
      if (existing) {
        return res.status(200).json({
          message: 'Task already exists (idempotent)',
          task: existing,
        });
      }
    }

    const task = await CallTask.create({
      lead_id,
      assigned_to,
      scheduled_at,
      status: 'pending',
      idempotency_key,
    });

    // Send SNS notification
    await sendSNSNotification(
      `New call task assigned to agent ${assigned_to} for lead ${lead_id}`,
      'New Call Task Assignment',
    );

    // Send Twilio SMS (in production, fetch agent phone from DB)
    await sendSMS(
      '+917796537874', // Replace with actual agent phone
      `You have a new call task scheduled for ${scheduled_at}`,
    );

    res.status(201).json({ message: 'Call task created', task });
  } catch (error: any) {
    console.error('Error creating call task:', error);
    res
      .status(500)
      .json({ message: 'Error creating call task', error: error.message });
  }
};

export const completeCallTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { notes, outcome, duration_minutes } = req.body;

    const task = await CallTask.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const completedAt = new Date();

    task.status = 'completed';
    task.notes = notes;
    task.outcome = outcome;
    task.completed_at = completedAt;
    await task.save();

    // Get agent details
    const agent = await User.findByPk(task.assigned_to);

    // Log to MongoDB for analytics
    await CallLog.create({
      task_id: task.id,
      lead_id: task.lead_id,
      agent_id: task.assigned_to,
      agent_name: agent?.name || 'Unknown',
      status: 'completed',
      outcome,
      scheduled_at: task.scheduled_at,
      completed_at: new Date(),
      call_date: new Date().toISOString().slice(0, 10), // 'YYYY-MM-DD'
    });

    // Send completion notification
    await sendSNSNotification(
      `Call task ${id} completed with outcome: ${outcome}`,
      'Call Task Completed',
    );

    res.json({ message: 'Task completed', task });
  } catch (error: any) {
    console.error('Error completing task:', error);
    res
      .status(500)
      .json({ message: 'Error completing task', error: error.message });
  }
};
export const getAllCallTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, assigned_to } = req.query;
    const where: any = {};

    if (status) where.status = status;
    if (assigned_to) where.assigned_to = assigned_to;

    const tasks = await CallTask.findAll({ where });
    res.json({ tasks });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res
      .status(500)
      .json({ message: 'Error fetching tasks', error: error.message });
  }
};

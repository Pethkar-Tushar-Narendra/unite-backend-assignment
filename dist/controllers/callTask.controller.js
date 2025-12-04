"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCallTasks = exports.completeCallTask = exports.createCallTask = void 0;
const callTask_model_1 = __importDefault(require("../models/callTask.model"));
const sns_service_1 = require("../services/sns.service");
const twilio_service_1 = require("../services/twilio.service");
const callLog_model_1 = require("../models/callLog.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const createCallTask = async (req, res) => {
    try {
        const { lead_id, assigned_to, scheduled_at, idempotency_key } = req.body;
        // Idempotency check
        if (idempotency_key) {
            const existing = await callTask_model_1.default.findOne({ where: { idempotency_key } });
            if (existing) {
                return res.status(200).json({
                    message: 'Task already exists (idempotent)',
                    task: existing,
                });
            }
        }
        const task = await callTask_model_1.default.create({
            lead_id,
            assigned_to,
            scheduled_at,
            status: 'pending',
            idempotency_key,
        });
        // Send SNS notification
        await (0, sns_service_1.sendSNSNotification)(`New call task assigned to agent ${assigned_to} for lead ${lead_id}`, 'New Call Task Assignment');
        // Send Twilio SMS (in production, fetch agent phone from DB)
        await (0, twilio_service_1.sendSMS)('+917796537874', // Replace with actual agent phone
        `You have a new call task scheduled for ${scheduled_at}`);
        res.status(201).json({ message: 'Call task created', task });
    }
    catch (error) {
        console.error('Error creating call task:', error);
        res
            .status(500)
            .json({ message: 'Error creating call task', error: error.message });
    }
};
exports.createCallTask = createCallTask;
const completeCallTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, outcome, duration_minutes } = req.body;
        const task = await callTask_model_1.default.findByPk(id);
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
        const agent = await user_model_1.default.findByPk(task.assigned_to);
        // Log to MongoDB for analytics
        await callLog_model_1.CallLog.create({
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
        await (0, sns_service_1.sendSNSNotification)(`Call task ${id} completed with outcome: ${outcome}`, 'Call Task Completed');
        res.json({ message: 'Task completed', task });
    }
    catch (error) {
        console.error('Error completing task:', error);
        res
            .status(500)
            .json({ message: 'Error completing task', error: error.message });
    }
};
exports.completeCallTask = completeCallTask;
const getAllCallTasks = async (req, res) => {
    try {
        const { status, assigned_to } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (assigned_to)
            where.assigned_to = assigned_to;
        const tasks = await callTask_model_1.default.findAll({ where });
        res.json({ tasks });
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res
            .status(500)
            .json({ message: 'Error fetching tasks', error: error.message });
    }
};
exports.getAllCallTasks = getAllCallTasks;
//# sourceMappingURL=callTask.controller.js.map
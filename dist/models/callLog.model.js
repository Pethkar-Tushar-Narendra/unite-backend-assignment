"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallLog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const callLogSchema = new mongoose_1.default.Schema({
    task_id: {
        type: Number,
        required: true,
    },
    lead_id: {
        type: Number,
        required: true,
    },
    agent_id: {
        type: Number,
        required: true,
    },
    agent_name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['completed', 'missed', 'pending'],
        required: true,
    },
    outcome: {
        type: String,
    },
    notes: {
        type: String,
    },
    scheduled_at: {
        type: Date,
        required: true,
    },
    completed_at: {
        type: Date,
    },
    duration_minutes: {
        type: Number,
    },
    call_date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
    },
}, {
    timestamps: true,
    collection: 'call_logs',
});
// Indexes for better query performance
callLogSchema.index({ agent_id: 1, call_date: 1 });
callLogSchema.index({ status: 1, call_date: 1 });
exports.CallLog = mongoose_1.default.model('CallLog', callLogSchema);
//# sourceMappingURL=callLog.model.js.map
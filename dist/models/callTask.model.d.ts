import { Model, Optional } from 'sequelize';
interface CallTaskAttributes {
    id: number;
    lead_id: number;
    assigned_to: number;
    scheduled_at: Date;
    status: 'pending' | 'completed' | 'missed';
    notes?: string;
    outcome?: string;
    completed_at?: Date;
    idempotency_key?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface CallTaskCreationAttributes extends Optional<CallTaskAttributes, 'id'> {
}
declare class CallTask extends Model<CallTaskAttributes, CallTaskCreationAttributes> implements CallTaskAttributes {
    id: number;
    lead_id: number;
    assigned_to: number;
    scheduled_at: Date;
    status: 'pending' | 'completed' | 'missed';
    notes?: string;
    outcome?: string;
    completed_at?: Date;
    idempotency_key?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default CallTask;
//# sourceMappingURL=callTask.model.d.ts.map
import mongoose from 'mongoose';
export declare const CallLog: mongoose.Model<{
    status: "pending" | "completed" | "missed";
    lead_id: number;
    scheduled_at: NativeDate;
    task_id: number;
    agent_id: number;
    agent_name: string;
    call_date: string;
    notes?: string | null;
    outcome?: string | null;
    completed_at?: NativeDate | null;
    duration_minutes?: number | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    status: "pending" | "completed" | "missed";
    lead_id: number;
    scheduled_at: NativeDate;
    task_id: number;
    agent_id: number;
    agent_name: string;
    call_date: string;
    notes?: string | null;
    outcome?: string | null;
    completed_at?: NativeDate | null;
    duration_minutes?: number | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
    collection: string;
}> & Omit<{
    status: "pending" | "completed" | "missed";
    lead_id: number;
    scheduled_at: NativeDate;
    task_id: number;
    agent_id: number;
    agent_name: string;
    call_date: string;
    notes?: string | null;
    outcome?: string | null;
    completed_at?: NativeDate | null;
    duration_minutes?: number | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    collection: string;
}, {
    status: "pending" | "completed" | "missed";
    lead_id: number;
    scheduled_at: NativeDate;
    task_id: number;
    agent_id: number;
    agent_name: string;
    call_date: string;
    notes?: string | null;
    outcome?: string | null;
    completed_at?: NativeDate | null;
    duration_minutes?: number | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    status: "pending" | "completed" | "missed";
    lead_id: number;
    scheduled_at: NativeDate;
    task_id: number;
    agent_id: number;
    agent_name: string;
    call_date: string;
    notes?: string | null;
    outcome?: string | null;
    completed_at?: NativeDate | null;
    duration_minutes?: number | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
    collection: string;
}>> & Omit<{
    status: "pending" | "completed" | "missed";
    lead_id: number;
    scheduled_at: NativeDate;
    task_id: number;
    agent_id: number;
    agent_name: string;
    call_date: string;
    notes?: string | null;
    outcome?: string | null;
    completed_at?: NativeDate | null;
    duration_minutes?: number | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        status: "pending" | "completed" | "missed";
        lead_id: number;
        scheduled_at: NativeDate;
        task_id: number;
        agent_id: number;
        agent_name: string;
        call_date: string;
        notes?: string | null;
        outcome?: string | null;
        completed_at?: NativeDate | null;
        duration_minutes?: number | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
        collection: string;
    }>> & Omit<{
        status: "pending" | "completed" | "missed";
        lead_id: number;
        scheduled_at: NativeDate;
        task_id: number;
        agent_id: number;
        agent_name: string;
        call_date: string;
        notes?: string | null;
        outcome?: string | null;
        completed_at?: NativeDate | null;
        duration_minutes?: number | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    status: "pending" | "completed" | "missed";
    lead_id: number;
    scheduled_at: NativeDate;
    task_id: number;
    agent_id: number;
    agent_name: string;
    call_date: string;
    notes?: string | null;
    outcome?: string | null;
    completed_at?: NativeDate | null;
    duration_minutes?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    status: "pending" | "completed" | "missed";
    lead_id: number;
    scheduled_at: NativeDate;
    task_id: number;
    agent_id: number;
    agent_name: string;
    call_date: string;
    notes?: string | null;
    outcome?: string | null;
    completed_at?: NativeDate | null;
    duration_minutes?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=callLog.model.d.ts.map
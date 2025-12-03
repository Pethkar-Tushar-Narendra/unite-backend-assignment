import { Model, Optional } from 'sequelize';
interface LeadAttributes {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    source: string;
    assigned_to?: number | bigint;
    createdAt?: Date;
    updatedAt?: Date;
}
interface LeadCreationAttributes extends Optional<LeadAttributes, 'id' | 'assigned_to' | 'createdAt' | 'updatedAt'> {
}
declare class Lead extends Model<LeadAttributes, LeadCreationAttributes> implements LeadAttributes {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    source: string;
    assigned_to?: number | bigint;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Lead;
//# sourceMappingURL=lead.model.d.ts.map
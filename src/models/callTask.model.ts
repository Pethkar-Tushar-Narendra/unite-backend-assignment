import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

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

interface CallTaskCreationAttributes extends Optional<
  CallTaskAttributes,
  'id'
> {}

class CallTask
  extends Model<CallTaskAttributes, CallTaskCreationAttributes>
  implements CallTaskAttributes
{
  public id!: number;
  public lead_id!: number;
  public assigned_to!: number;
  public scheduled_at!: Date;
  public status!: 'pending' | 'completed' | 'missed';
  public notes?: string;
  public outcome?: string;
  public completed_at?: Date;
  public idempotency_key?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CallTask.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    lead_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Leads',
        key: 'id',
      },
    },
    assigned_to: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'missed'),
      defaultValue: 'pending',
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    outcome: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    idempotency_key: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'CallTasks',
    timestamps: true,
  },
);

export default CallTask;

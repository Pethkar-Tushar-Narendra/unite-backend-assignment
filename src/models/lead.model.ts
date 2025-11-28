import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Lead attributes interface
interface LeadAttributes {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  assigned_to?: number | bigint; // User ID who owns this lead
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields for creation
interface LeadCreationAttributes extends Optional<
  LeadAttributes,
  'id' | 'assigned_to' | 'createdAt' | 'updatedAt'
> {}

// Lead model class
class Lead
  extends Model<LeadAttributes, LeadCreationAttributes>
  implements LeadAttributes
{
  public id!: number;
  public name!: string;
  public phone!: string;
  public email!: string;
  public status!: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  public source!: string;
  public assigned_to?: number | bigint;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Lead model
Lead.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name is required',
        },
        len: {
          args: [2, 100],
          msg: 'Name must be between 2 and 100 characters',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: {
        name: 'unique_phone',
        msg: 'Phone number already exists',
      },
      validate: {
        notEmpty: {
          msg: 'Phone is required',
        },
        is: {
          args: /^[0-9+\-\s()]+$/,
          msg: 'Invalid phone number format',
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: 'unique_email',
        msg: 'Email already exists',
      },
      validate: {
        notEmpty: {
          msg: 'Email is required',
        },
        isEmail: {
          msg: 'Invalid email format',
        },
      },
    },
    status: {
      type: DataTypes.ENUM(
        'new',
        'contacted',
        'qualified',
        'converted',
        'lost',
      ),
      allowNull: false,
      defaultValue: 'new',
      validate: {
        isIn: {
          args: [['new', 'contacted', 'qualified', 'converted', 'lost']],
          msg: 'Invalid status value',
        },
      },
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Source is required',
        },
      },
    },
    assigned_to: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'Leads',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
        name: 'idx_unique_email',
      },
      {
        unique: true,
        fields: ['phone'],
        name: 'idx_unique_phone',
      },
      {
        fields: ['status'],
        name: 'idx_status',
      },
      {
        fields: ['assigned_to'],
        name: 'idx_assigned_to',
      },
    ],
  },
);

export default Lead;

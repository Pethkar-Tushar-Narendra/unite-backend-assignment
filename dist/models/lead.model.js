"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// Lead model class
class Lead extends sequelize_1.Model {
}
// Initialize Lead model
Lead.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
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
        type: sequelize_1.DataTypes.STRING(15),
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
        type: sequelize_1.DataTypes.STRING(100),
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
        type: sequelize_1.DataTypes.ENUM('new', 'contacted', 'qualified', 'converted', 'lost'),
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
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Source is required',
            },
        },
    },
    assigned_to: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize: database_1.default,
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
});
exports.default = Lead;
//# sourceMappingURL=lead.model.js.map
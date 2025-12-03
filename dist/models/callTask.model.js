"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class CallTask extends sequelize_1.Model {
}
CallTask.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    lead_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'Leads',
            key: 'id',
        },
    },
    assigned_to: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    scheduled_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'completed', 'missed'),
        defaultValue: 'pending',
        allowNull: false,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    outcome: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    completed_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    idempotency_key: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        unique: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'CallTasks',
    timestamps: true,
});
exports.default = CallTask;
//# sourceMappingURL=callTask.model.js.map
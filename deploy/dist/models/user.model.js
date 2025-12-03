"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class User extends sequelize_1.Model {
    // Validate password method
    async validatePassword(password) {
        return await bcrypt_1.default.compare(password, this.password);
    }
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('admin', 'manager', 'agent'),
        defaultValue: 'agent',
    },
}, {
    sequelize: database_1.default,
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt_1.default.genSalt(10);
                user.password = await bcrypt_1.default.hash(user.password, salt);
            }
        },
    },
});
exports.default = User;
//# sourceMappingURL=user.model.js.map
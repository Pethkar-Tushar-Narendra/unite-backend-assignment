"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMySQL = void 0;
const sequelize_1 = require("sequelize");
const promise_1 = __importDefault(require("mysql2/promise")); // Import mysql2 promise wrapper
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbName = process.env.DB_NAME || 'unite_db';
const dbUser = process.env.DB_USER || 'admin';
const dbPass = process.env.DB_PASS || 'password';
const dbHost = process.env.DB_HOST || 'localhost';
// Function to create DB if it doesn't exist
const initializeDatabase = async () => {
    try {
        // Connect to MySQL server WITHOUT specifying a database
        const connection = await promise_1.default.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPass,
        });
        // Create the database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`✅ Database "${dbName}" checked/created successfully.`);
        await connection.end();
    }
    catch (error) {
        console.error('❌ Error creating database:', error);
        process.exit(1);
    }
};
// Initialize Sequelize (will be exported)
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: 'mysql',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});
const connectMySQL = async () => {
    await initializeDatabase(); // Run the check first
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Connection has been established successfully.');
    }
    catch (error) {
        console.error('❌ Unable to connect to the MySQL database:', error);
        process.exit(1);
    }
};
exports.connectMySQL = connectMySQL;
exports.default = sequelize;
//# sourceMappingURL=database.js.map
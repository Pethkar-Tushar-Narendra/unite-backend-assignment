"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const mongodb_1 = __importDefault(require("./config/mongodb"));
require("./config/redis");
const database_2 = __importDefault(require("./config/database")); // Import sequelize instance for syncing
const config_1 = __importDefault(require("./config/config"));
const startServer = async () => {
    try {
        // 1. Connect to MySQL (Create DB if missing)
        await (0, database_1.connectMySQL)();
        // 2. Connect to MongoDB
        await (0, mongodb_1.default)();
        // 3. Sync Sequelize Models (Create tables) - THIS WAS MISSING
        // { alter: true } updates tables if columns change without dropping data
        await database_2.default.sync({ alter: true });
        console.log('✅ Database & tables synced');
        // 4. NOW import the app (which loads models)
        const app = (await Promise.resolve().then(() => __importStar(require('./app')))).default;
        const PORT = config_1.default.port || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map
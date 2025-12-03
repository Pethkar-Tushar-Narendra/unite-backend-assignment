"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const mongodb_1 = __importDefault(require("./config/mongodb"));
require("./config/redis");
const csvWorker_1 = require("./workers/csvWorker");
dotenv_1.default.config();
const startWorker = async () => {
    try {
        await (0, database_1.connectMySQL)();
        await (0, mongodb_1.default)();
        console.log('✅ Worker connected to databases');
        await (0, csvWorker_1.startCSVWorker)();
    }
    catch (error) {
        console.error('❌ Worker startup failed:', error);
        process.exit(1);
    }
};
startWorker();
//# sourceMappingURL=worker.js.map
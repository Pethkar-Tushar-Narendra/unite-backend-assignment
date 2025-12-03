"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./middlewares/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const lead_routes_1 = __importDefault(require("./routes/lead.routes"));
const callTask_routes_1 = __importDefault(require("./routes/callTask.routes"));
const csv_routes_1 = __importDefault(require("./routes/csv.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/items', itemRoutes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/leads', lead_routes_1.default);
app.use('/api/call-tasks', callTask_routes_1.default);
app.use('/api/csv', csv_routes_1.default);
app.use('/api/reports', report_routes_1.default);
// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Unite Backend API', status: 'running' });
});
// Global error handler (should be after routes)
app.use(errorHandler_1.errorHandler);
app.use((err, req, res, next) => {
    console.error('🔥 Global Error Handler:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});
// Sync Database (Create tables if not exist)
// sequelize.sync({ alter: true }).then(() => {
//   console.log('✅ Database & tables synced');
// });
exports.default = app;
//# sourceMappingURL=app.js.map
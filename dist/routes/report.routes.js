"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../controllers/report.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateJWT);
router.get('/daily-summary', report_controller_1.getDailySummary);
router.get('/agent-performance', report_controller_1.getAgentPerformance);
router.get('/insights', report_controller_1.getInsights);
exports.default = router;
//# sourceMappingURL=report.routes.js.map
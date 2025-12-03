"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const csv_controller_1 = require("../controllers/csv.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateJWT);
router.post('/upload', csv_controller_1.uploadCSVMiddleware, csv_controller_1.uploadCSV);
router.get('/logs', csv_controller_1.getCSVLogs);
exports.default = router;
//# sourceMappingURL=csv.routes.js.map
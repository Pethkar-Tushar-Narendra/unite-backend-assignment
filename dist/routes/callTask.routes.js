"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const callTask_controller_1 = require("../controllers/callTask.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateJWT);
router.post('/', callTask_controller_1.createCallTask);
router.put('/:id/complete', callTask_controller_1.completeCallTask);
router.get('/', callTask_controller_1.getAllCallTasks);
exports.default = router;
//# sourceMappingURL=callTask.routes.js.map
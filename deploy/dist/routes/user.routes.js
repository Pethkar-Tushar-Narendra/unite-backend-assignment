"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const user_model_1 = __importDefault(require("../models/user.model"));
const router = (0, express_1.Router)();
// 1. A route for any logged-in user to see their own profile
router.get('/me', auth_middleware_1.authenticateJWT, async (req, res) => {
    try {
        // req.user is added by the authenticateJWT middleware
        const user = await user_model_1.default.findByPk(req.user?.id, {
            attributes: ['id', 'name', 'email', 'role'], // Exclude password
        });
        if (!user)
            return res.sendStatus(404);
        res.json(user);
    }
    catch (error) {
        res.sendStatus(500);
    }
});
// 2. A route ONLY for admins
router.get('/admin-dashboard', auth_middleware_1.authenticateJWT, (0, rbac_middleware_1.authorizeRoles)('admin'), (req, res) => {
    res.json({ message: `Welcome to the admin dashboard, ${req.user?.id}!` });
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map
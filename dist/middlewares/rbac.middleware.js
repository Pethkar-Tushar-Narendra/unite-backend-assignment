"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ message: 'Access Denied: Insufficient permissions' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=rbac.middleware.js.map
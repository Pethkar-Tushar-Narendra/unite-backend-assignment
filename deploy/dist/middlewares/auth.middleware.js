"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden (Invalid token)
            }
            req.user = user;
            next();
        });
    }
    else {
        res.sendStatus(401); // Unauthorized
    }
};
exports.authenticateJWT = authenticateJWT;
//# sourceMappingURL=auth.middleware.js.map
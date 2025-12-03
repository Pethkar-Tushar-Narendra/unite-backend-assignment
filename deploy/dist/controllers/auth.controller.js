"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateTokens = (user) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log('Registering user:', { name, email, role });
        const existingUser = await user_model_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await user_model_1.default.create({ name, email, password, role });
        console.log('User created:', user.id);
        res
            .status(201)
            .json({ message: 'User registered successfully', userId: user.id });
    }
    catch (error) {
        console.error('Registration Error:', error);
        res
            .status(500)
            .json({ message: 'Error registering user', error: String(error) });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ where: { email } });
        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = generateTokens(user);
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: 'Login error', error });
    }
};
exports.login = login;
const refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret', async (err, user) => {
        if (err)
            return res.sendStatus(403);
        try {
            const foundUser = await user_model_1.default.findByPk(user.id);
            if (!foundUser)
                return res.sendStatus(403);
            const accessToken = jsonwebtoken_1.default.sign({ id: foundUser.id, role: foundUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
            res.json({ accessToken });
        }
        catch (error) {
            res.sendStatus(500);
        }
    });
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.controller.js.map
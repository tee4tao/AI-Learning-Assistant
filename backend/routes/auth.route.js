import { Router } from "express";
import {body} from 'express-validator';
import { changePassword, getProfile, login, register, updateProfile } from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

const registerValidation = [
    body('username').trim().isLength({min:3}).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];


authRouter.post('/register', registerValidation, register);

authRouter.post('/login', loginValidation, login);


// Handle profile logic here
authRouter.get('/profile',authorize, getProfile);
authRouter.put('/profile', authorize, updateProfile);
authRouter.post('/change-password', authorize, changePassword);


export default authRouter;
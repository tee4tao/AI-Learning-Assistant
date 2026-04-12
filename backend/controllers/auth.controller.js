// @desc    Register new user
// @route   POST /api/v1/auth/register

import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

// @access  Public
export const register = async (req, res, next) =>{
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {username, email, password} = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ success: false, error: userExists.email === email ? "Email already exists" : "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{ username, email, password: hashedPassword }], {session});

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        await session.commitTransaction();
        // session.endSession();
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data:{
                user: newUsers[0],
                token
            }
        });

    } catch (error) {
        session.abortTransaction()
        session.endSession()
        next(error);
    }
}

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) =>{
    try {
        
    } catch (error) {
        next(error);
    }
}

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
export const getProfile = async (req, res, next) =>{
    try {
        
    } catch (error) {
        next(error);
    }
}

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) =>{
    try {
        
    } catch (error) {
        next(error);
    }
}

// @desc    Change user password
// @route   POST /api/v1/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) =>{
    try {
        
    } catch (error) {
        next(error);
    }
}
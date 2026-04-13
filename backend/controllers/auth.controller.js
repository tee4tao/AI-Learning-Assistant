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
        const { email, password } = req.body;

        // validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Please provide email and password" });
        }

        const userExists = await User.findOne({ email }).select("+password");
        if(!userExists) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, userExists.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: userExists._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                user: userExists,
                token
            }
        });
    } catch (error) {
        next(error);
    }
}

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
export const getProfile = async (req, res, next) =>{
    try {
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: 'User profile retrieved successfully',
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
}

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) =>{
    try {
        const {username, email, profileImage} = req.body;

        const user = await User.findById(req.user._id);

        if (username !==undefined) user.username = username;
        if (email) user.email = email;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User profile updated successfully',
            data: {
                user
            }
        });


        // const updatedUser = await User.findByIdAndUpdate(req.user._id, {username, email, profileImage}, { returnDocument: "after", runValidators: true });

        // if (!updatedUser) {
        //     return res.status(404).json({ success: false, error: "User not found" });
        // }

        // res.status(200).json({
        //     success: true,
        //     message: 'User profile updated successfully',
        //     data: {
        //         user: updatedUser
        //     }
        // });
    } catch (error) {
        next(error);
    }
}

// @desc    Change user password
// @route   POST /api/v1/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) =>{
    try {
        const {currentPassword, newPassword} = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, error: "Please provide current and new passwords" });
        }

        const user = await User.findById(req.user._id).select("+password");

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Current password is incorrect" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);


        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        next(error);
    }
}
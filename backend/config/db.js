import mongoose from "mongoose";
import process from 'node:process';
import { DB_URI, NODE_ENV } from "../config/env.js";


if (!DB_URI) {
    throw new Error("Database URI is not defined");
}

const connectToDatabase = async () =>{
    try {
        await mongoose.connect(DB_URI);
        console.log(`connected to database in ${NODE_ENV} mode`);
        
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1)
    }
}

export default connectToDatabase;
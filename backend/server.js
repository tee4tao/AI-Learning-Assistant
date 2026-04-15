import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import errorMiddleware from './middlewares/error.middleware.js';
import connectToDatabase from './config/db.js';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.route.js';
import documentRouter from './routes/document.route.js';

// ES6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// connect to MongoDB
connectToDatabase();

// Middleware to handle CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/documents', documentRouter);

app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        statusCode: 404
    });
});

// Start server
// const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});
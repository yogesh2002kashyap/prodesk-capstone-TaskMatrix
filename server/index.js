require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const workspaceRoutes = require('./routes/workspaces');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const stripeRoutes = require('./routes/stripe');
const aiRoutes = require('./routes/ai');

const app = express();

const REQUIRED_ENV = [
    'MONGO_URI',
    'JWT_SECRET',
    'PORT',
    'CLIENT_URL',
    'STRIPE_SECRET_KEY',
    'STRIPE_PRICE_ID',
    'GEMINI_API_KEY',
];

if (process.env.NODE_ENV !== 'test') {
    const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

    if (missing.length) {
        console.error(
            `Missing required environment variables: ${missing.join(', ')}`
        );
        process.exit(1);
    }
}

// Security middleware
app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'TaskMatrix API is running',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/ai', aiRoutes);

// Global error handler (must be last)
app.use(errorHandler);

// Database connection
if (process.env.NODE_ENV !== 'test') {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.info('MongoDB connected');

            app.listen(process.env.PORT, () => {
                console.info(
                    `Server running on port ${process.env.PORT}`
                );
            });
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        });
}

module.exports = app;
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/errorHandler');


const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'PORT', 'CLIENT_URL', 'STRIPE_SECRET_KEY', 'STRIPE_PRICE_ID', 'GEMINI_API_KEY'];
if (process.env.NODE_ENV !== 'test') {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

const authRoutes = require('./routes/auth');
const workspaceRoutes = require('./routes/workspaces');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const stripeRoutes = require('./routes/stripe');
const aiRoutes = require('./routes/ai');

const app = express();


app.use(helmet());


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));


if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
  });
  app.use('/api', limiter);
}


app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());


app.use(mongoSanitize());


app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/ai', aiRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'TaskMatrix API running' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
  });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
      app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
      });
    })
    .catch((err) => console.error('MongoDB connection error:', err));
}

module.exports = app;

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/index');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorMiddleware');
const asyncHandler = require('express-async-handler');

// Load env vars
dotenv.config({ path: './config/.env' });

// Set port from environment variables or default to 7000
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
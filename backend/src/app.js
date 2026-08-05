require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Allow CORS from the frontend dev server and allow credentials for cookies
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());


/**
 * @Routes authentication routes
 * description: Routes for user authentication (login, register, etc.)
 */

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);


module.exports = app;
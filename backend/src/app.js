require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));


/**
 * @Routes authentication routes
 * description: Routes for user authentication (login, register, etc.)
 */

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);


module.exports = app;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Request logging for debugging
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.originalUrl}`);
    next();
});

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// JSON parse error handler: responds with a clear JSON error and logs the Content-Type.
// This avoids the default HTML error body and helps diagnose malformed requests.
app.use((err, req, res, next) => {
    if (err && err.type === 'entity.parse.failed') {
        console.error('[JSON PARSE ERROR] content-type=', req.headers['content-type']);
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next(err);
});

app.use(cors({
    origin: (origin, cb) => {
        // Allow local dev origins and undefined (tools like curl/postman)
        if (!origin || origin.startsWith('http://localhost')) return cb(null, true);
        cb(new Error('CORS not allowed'));
    },
    credentials: true, // Allow cookies to be sent
}));


/**
 * @Routes authentication routes
 * description: Routes for user authentication (login, register, etc.)
 */

const authRoutes = require('./routes/auth.routes');
const interviewRoutes = require('./routes/interview.routes');
app.use('/auth', authRoutes);
app.use('/interview', interviewRoutes);


module.exports = app;


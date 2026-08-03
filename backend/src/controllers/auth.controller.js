const userModel = require('../models/user.model');
const blacklistModel = require('../models/blacklist.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @name register
 * @description: Registers a new user in the database
 * @param {Object} req - The request object containing user data
 */

async function registerUser(req, res) {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const ifUserExists = await userModel.findOne({
            $or: [{ username: username }, { email: email }]
         });
        if (ifUserExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword
        });

        // Persist the user to the database
        await newUser.save();

        const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET;
        if (!jwtSecret) {
          console.warn('JWT secret not set in environment; using temporary development secret');
        }
        const token = jwt.sign({ id: newUser._id }, jwtSecret || 'dev_secret', { expiresIn: '1h' });

        // For local development do not set secure flag to true (requires HTTPS)
        const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' };
        res.cookie('token', token, cookieOptions);

        res.status(201).json({ message: 'User registered successfully', 
            user: { id: newUser._id, username: newUser.username, email: newUser.email } });

        }
        catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
        
}

/**
 * @name login
 * @description: Logs in a user and returns a JWT token
 * @param {Object} req - The request object containing user credentials
 */

async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const user = await userModel.findOne({
            $or: [{ username: username }, { email: email }]
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({ message: 'Login successful',
            user: { id: user._id, username: user.username, email: user.email } });
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }}


/**
 * @name logout
 * @description: Logs out a user by blacklisting the JWT token
 * @param {Object} req - The request object containing the JWT token
 */

async function logoutUser(req, res) {
    try {
        const token = req.cookies && req.cookies.token;
        if (token) {
            // store the token in blacklist to invalidate server-side if using stateless JWT
            try {
                await blacklistModel.create({ token });
            } catch (e) {
                // log and continue — logout should succeed even if blacklist write fails
                console.warn('Could not write token to blacklist:', e.message || e);
            }
        }

        // clear the cookie on client
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * @name getMe
 * @description: Returns the current authenticated user's information
 * @param {Object} req - The request object containing the authenticated user
 */

async function getMe(req, res) {
    const userID = await userModel.findById(req.user.id).select('-password');

    res.status(200).json({ message: 'User retrieved successfully',
         user:{
            id: userID._id,
            username: userID.username,
            email: userID.email
         } });





}
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe
};
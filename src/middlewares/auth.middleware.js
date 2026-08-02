const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');

async function authenticateToken(req, res, next) {
  try {
    // Support token in cookie or Authorization header
    const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Check blacklist
    try {
      const blacklisted = await blacklistModel.findOne({ token });
      if (blacklisted) {
        return res.status(401).json({ message: 'Token revoked' });
      }
    } catch (e) {
      // if blacklist check fails, log and continue (do not block auth on DB issues)
      console.warn('Blacklist check failed:', e && e.message ? e.message : e);
    }

    const jwtSecret = process.env.JWT_SECRET || process.env.jwt_secret || 'dev_secret';

    let payload;
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach the payload to req.user for downstream handlers
    req.user = payload;
    return next();
  } catch (err) {
    console.error('authenticateToken error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  authenticateToken,
};
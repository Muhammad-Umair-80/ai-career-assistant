const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');

/**
 * @Routes post /auth/register
 * @description: Routes for user authentication (login, register, etc.)
 * 
 */
router.post('/register', authController.registerUser);


/**
 * @Routes post /auth/login
 * @description: Routes for user authentication (login, register, etc.)
 * 
 */
router.post('/login', authController.loginUser);    
 

/**
 * @Routes GET /auth/logout
 * @description: Routes for user authentication (login, register, etc.)
 */

router.get('/logout', authController.logoutUser);

/**
 * @Routes GET api/auth/get-me
 * @description: Route to get the current authenticated user's information
 * @access: Private (requires authentication)
 */
router.get('/get-me', authenticateToken.authenticateToken, authController.getMe);

module.exports = router;






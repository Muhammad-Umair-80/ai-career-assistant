const express = require('express');
const multer = require('multer');
const {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
} = require('../controllers/interview.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function conditionalUpload(req, res, next) {
    const contentType = (req.headers['content-type'] || '').toLowerCase();
    if (contentType.includes('multipart/form-data')) {
        return upload.any()(req, res, next);
    }
    next();
}

/**
 * @Routes POST /auth/interview
 * @description: Generate an interview report from AI and optionally save it to the database.
 * Accepts JSON with fields: resumeDescription, selfDescription, jobDescription.
 * Optionally supports multipart/form-data with a PDF upload field named `resumeFile`.
 */
// Mount POST on the router root so when the router is used with app.use('/interview', ...) the endpoint becomes POST /interview
router.post('/', conditionalUpload, generateInterviewReportController);

/**
 * @route POST /interview/resume/pdf/:interviewId
 * @description Generate a PDF resume for an existing interview report
 * @access private
 */
router.post('/resume/pdf/:interviewId', authenticateToken, generateResumePdfController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by ID
 * @access private
 */
router.get("/report/:interviewId", authenticateToken, getInterviewReportByIdController);

/**
 * @route GET /api/interview
 * @description get all interview reports for the authenticated user
 * @access private
 */
router.get("/", authenticateToken, getAllInterviewReportsController);
 




module.exports = router;

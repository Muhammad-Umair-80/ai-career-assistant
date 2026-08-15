const express = require('express');
const multer = require('multer');
const interviewController = require('../controllers/interview.controller');

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
router.post('/interview', conditionalUpload, interviewController.generateInterviewReportController);

module.exports = router;

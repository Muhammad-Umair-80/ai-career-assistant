const { parsePDF } = require('../utils/pdfParser');
const generateInterviewReport = require('../services/ai.service').generateInterviewReport;
const InterviewReportModel = require('../models/interviewReport.model');

/**
 * Generates an interview report based on the provided resume and job description.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function generateInterviewReportController(req, res) {
    try {
        const file = req.file || (req.files && req.files[0]);
        if (!file || !file.buffer) {
            return res.status(400).json({ error: 'Resume PDF file is required (field: resume or first file).' });
        }

        // Ensure we pass a plain Uint8Array (not a Node Buffer) to pdf parsers like pdfjs-dist
        let pdfBuffer;
        if (Buffer.isBuffer(file.buffer)) {
            pdfBuffer = new Uint8Array(file.buffer);
        } else if (file.buffer instanceof Uint8Array) {
            // Already a Uint8Array (and not a Buffer subclass)
            pdfBuffer = file.buffer;
        } else {
            // Fallback: create a Uint8Array from whatever binary-like value was provided
            pdfBuffer = new Uint8Array(file.buffer);
        }
        console.log('Extracting text from PDF:', file.originalname || file.fieldname);
        const resumeText = await parsePDF(pdfBuffer);
        if (!resumeText) {
            return res.status(400).json({ error: 'Could not extract text from PDF. Ensure the PDF contains selectable text or provide resumeDescription.' });
        }

        let { jobDescription, selfDescription } = req.body || {};
        // If selfDescription is missing, proceed with an empty string (user chose this behavior)
        if (typeof selfDescription === 'undefined' || selfDescription === null) {
            selfDescription = '';
        }
        const interviewReportByAi = await generateInterviewReport({
            jobDescription,
            resumeDescription: resumeText,
            selfDescription
        });

        const interviewReport = await InterviewReportModel.create({
            user: req.user ? req.user._id : null,
            resumeDescription: resumeText,
            jobDescription,
            selfDescription,
            ...interviewReportByAi
        });

        res.status(200).json({
            message: 'Interview report generated successfully',
            interviewReport
        });
    } catch (error) {
        console.error('Error generating interview report:', error);
        res.status(500).json({ error: 'Failed to generate interview report' });
    }
}


/**
 * @description Get interview report by ID
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params;

    const interviewReport = await InterviewReportModel.findById({_id: interviewId , user: req.user._id});

    if (!interviewReport) {
        return res.status(404).json({ error: 'Interview report not found' });
    }
    
    res.status(200).json({
        message: 'Interview report retrieved successfully',
        interviewReport
    });
}

 /**
  * @description Get all interview reports for the authenticated user
  * @param {*} req 
  * @param {*} res
  */

 async function getAllInterviewReportsController(req, res) {
    const interviewReports = (await InterviewReportModel.find({ user: req.user._id })).sort({ createdAt: -1 }).select("-resumeDescription -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparation "); // Sort by creation date, newest first

    res.status(200).json({
        message: 'Interview reports retrieved successfully',
        interviewReports
    });
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewId } = req.params;
        if (!interviewId) return res.status(400).json({ error: 'interviewId parameter is required' });

        const interviewReport = await InterviewReportModel.findOne({ _id: interviewId, user: req.user ? req.user._id : null });
        if (!interviewReport) {
            return res.status(404).json({ error: 'Interview report not found' });
        }

        const aiService = require('../services/ai.service');
        const pdfBuffer = await aiService.generateResumePdf({
            resume: interviewReport.resumeDescription,
            selfDescription: interviewReport.selfDescription,
            jobDescription: interviewReport.jobDescription,
        });

        if (!pdfBuffer) {
            return res.status(500).json({ error: 'Failed to generate PDF' });
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="resume-${interviewId}.pdf"`,
        });
        return res.send(pdfBuffer);
    } catch (err) {
        console.error('Error generating resume PDF:', err);
        return res.status(500).json({ error: 'Failed to generate resume PDF' });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};


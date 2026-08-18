const { parsePDF } = require('../utils/pdfParser');
const generateInterviewReport = require('../services/ai.service').generateInterviewReport;
const InterviewReportModel = require('../models/interviewReport.model');

async function generateInterviewReportController(req, res) {
    try {
        const file = req.file || (req.files && req.files[0]);

        // Accept either a PDF upload (preferred) or a plain resumeDescription in the JSON body.
        let resumeText = null;
        if (file && file.buffer) {
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
            resumeText = await parsePDF(pdfBuffer);
            if (!resumeText) {
                return res.status(400).json({ error: 'Could not extract text from PDF. Ensure the PDF contains selectable text or provide resumeDescription.' });
            }
        } else if (req.body && req.body.resumeDescription) {
            resumeText = String(req.body.resumeDescription);
        } else {
            return res.status(400).json({ error: 'Missing resume: provide a PDF file (multipart/form-data) or resumeDescription in JSON body.' });
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

        // Ensure required model fields are present - Title is required by schema
        const titleFromAi = interviewReportByAi && (interviewReportByAi.title || interviewReportByAi.name || interviewReportByAi.titleText);
        const defaultTitle = titleFromAi || (jobDescription ? String(jobDescription).slice(0, 80) : 'Interview Report');

        const interviewReportPayload = Object.assign({
            user: req.user ? req.user._id : null,
            resumeDescription: resumeText,
            jobDescription,
            selfDescription,
            title: defaultTitle,
        }, interviewReportByAi);

        const interviewReport = await InterviewReportModel.create(interviewReportPayload);

        res.status(200).json({
            message: 'Interview report generated successfully',
            interviewReport
        });
    } catch (error) {
        console.error('Error generating interview report:', error);
        res.status(500).json({ error: 'Failed to generate interview report' });
    }
}

async function getInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;
        if (!interviewId) return res.status(400).json({ error: 'Interview ID is required' });
        const report = await InterviewReportModel.findById(interviewId).lean();
        if (!report) return res.status(404).json({ error: 'Interview report not found' });
        res.status(200).json({ interviewReport: report });
    } catch (err) {
        console.error('Error fetching interview report:', err);
        res.status(500).json({ error: 'Failed to fetch interview report' });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportController
};


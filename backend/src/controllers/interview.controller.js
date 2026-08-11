const pdfParse = require('pdf-parse');
const InterviewReport = require('../models/interviewReport.model');

function normalizeInterviewFields(body) {
    body = body || {};
    return {
        jobDescription: body.jobDescription || body.job_description || body.jd || body.job || body.job_desc || body.jobDesc,
        resumeDescription: body.resumeDescription || body.resume_description || body.resume || body.resumeDesc || body.resumeText,
        selfDescription: body.selfDescription || body.self_description || body.aboutMe || body.self || body.self_desc || body.selfDesc,
    };
}

async function extractTextFromPDF(buffer) {
    try {
        const data = await pdfParse(buffer);
        const text = data.text && data.text.trim();
        if (text && text.length > 0) {
            return text;
        }
    } catch (error) {
        console.error('PDF parsing error:', error.message || error);
    }
    return null;
}

async function createInterviewReport(req, res) {
    try {
        const body = req.body || {};
        let { jobDescription, resumeDescription, selfDescription } = normalizeInterviewFields(body);
        const files = req.files || (req.file ? [req.file] : []);
        const file = files.find((f) => f.fieldname === 'resume') || files.find((f) => f.fieldname === 'resumeFile') || files[0];

        if (file && file.buffer && !resumeDescription) {
            try {
                console.log('Extracting text from PDF:', file.originalname || file.fieldname);
                const extractedText = await extractTextFromPDF(file.buffer);
                if (extractedText) {
                    resumeDescription = extractedText;
                    console.log('Successfully extracted PDF text, length:', resumeDescription.length);
                } else {
                    console.warn('No text could be extracted from PDF');
                }
            } catch (parseError) {
                console.error('Error extracting PDF text:', parseError.message || parseError);
            }
        }

        if (!jobDescription || !resumeDescription || !selfDescription) {
            return res.status(400).json({
                message: 'jobDescription, resumeDescription and selfDescription are required.',
                receivedBody: body,
                receivedFields: {
                    jobDescription: Boolean(jobDescription),
                    resumeDescription: Boolean(resumeDescription),
                    selfDescription: Boolean(selfDescription),
                },
                fileProvided: Boolean(file),
                fileFieldNames: (files || []).map((f) => f.fieldname),
            });
        }

        const { generateInterviewReport } = require('../services/ai.service');
        const report = await generateInterviewReport({ jobDescription, resumeDescription, selfDescription });

        const interviewReport = await InterviewReport.create({
            jobDescription,
            resumeDescription,
            selfDescription,
            matchScore: report.matchScore,
            technicalQuestions: report.technicalQuestions || [],
            behavioralQuestions: report.behavioralQuestions || [],
            skillGaps: report.skillGaps || [],
            preparations: report.preparation || report.preparations || [],
        });

        return res.status(201).json({
            message: 'Interview report generated successfully',
            report: interviewReport,
        });
    } catch (error) {
        console.error('Error generating interview report:', error);
        return res.status(500).json({ message: error.message || 'Failed to generate interview report.' });
    }
}

module.exports = {
    createInterviewReport,
};

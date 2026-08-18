require('dotenv').config();
const connectDB = require('./src/config/database');
const InterviewReportModel = require('./src/models/interviewReport.model');
const { generateInterviewReport } = require('./src/services/ai.service');
(async () => {
  try {
    await connectDB();
    console.log('DB connected');
    const aiReport = await generateInterviewReport({
      resumeDescription: 'Experienced software engineer with 6 years building Node.js backends, Express, MongoDB, and PDF processing.',
      jobDescription: 'Senior Backend Engineer role requiring Node.js, Express, MongoDB, and system design.',
      selfDescription: 'I focus on backend reliability, API design, and performance.'
    });
    const doc = await InterviewReportModel.create({
      resumeDescription: 'Sample resume text',
      jobDescription: 'Sample job text',
      selfDescription: 'Sample self description',
      matchScore: aiReport.matchScore || 0,
      technicalQuestions: aiReport.technicalQuestions || [],
      behavioralQuestions: aiReport.behavioralQuestions || [],
      skillGaps: aiReport.skillGaps || [],
      preparations: aiReport.preparations || [],
      title: 'Automated Test Report'
    });
    console.log('Saved report id:', doc._id.toString());
    process.exit(0);
  } catch (err) {
    console.error('Error saving report:', err);
    process.exit(1);
  }
})();
require('dotenv').config();
const { generateInterviewReport } = require('./src/services/ai.service');
(async () => {
  try {
    console.log('Calling generateInterviewReport with sample data...');
    const result = await generateInterviewReport({
      resumeDescription: 'Experienced software engineer with 6 years building Node.js backends, Express, MongoDB, and PDF processing.',
      jobDescription: 'Senior Backend Engineer role requiring Node.js, Express, MongoDB, and system design.',
      selfDescription: 'I focus on backend reliability, API design, and performance.'
    });
    console.log('AI result (truncated):', JSON.stringify(result, null, 2).slice(0, 2000));
  } catch (err) {
    console.error('Error during AI generation:', err);
    process.exit(1);
  }
})();
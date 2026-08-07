require ('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const {jobDescription, resumeDescription, selfDescription} = require('./src/services/temp');
const {generateInterviewReport} = require('./src/services/ai.service');

async function bootstrap() {
  await connectDB();

  const interviewReport = await generateInterviewReport({
    jobDescription,
    resumeDescription,
    selfDescription,
  });
  console.log('Google AI interview report:');
  console.log(JSON.stringify(interviewReport, null, 2));

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}

bootstrap().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});

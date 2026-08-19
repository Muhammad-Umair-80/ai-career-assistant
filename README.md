# AI Career Assistant

AI Career Assistant is a full-stack application designed to help job seekers prepare for interviews with confidence. It analyzes a candidate's resume, self-description, and target job description, then generates a personalized interview report powered by AI.

The platform helps users understand where they stand for a role, what technical and behavioral questions they may face, what skill gaps they should work on, and how to plan their prep in a structured way.

## Why this project?

Applying for jobs is hard, and interview preparation is often time-consuming and inconsistent. This project aims to simplify that process by combining:

- Resume and job-matching analysis
- AI-generated mock interview feedback
- Skill gap identification
- Structured preparation roadmap
- Resume PDF generation based on the analyzed profile
- User authentication and saved report history

## Features

- Upload a resume PDF or provide resume details manually
- Paste a target job description
- Add a short self-description to highlight strengths and experience
- Generate an AI-powered interview report with:
  - Match score
  - Technical questions and suggested answers
  - Behavioral questions and guidance
  - Skill gap analysis
  - Day-by-day preparation plan
- View saved interview reports for previous applications
- Download a generated resume PDF for the target job
- Secure login/register flow for authenticated users

## Tech Stack

### Frontend
- React
- Vite
- React Router
- SCSS for styling

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT-based authentication
- Multer for file upload handling

### AI + Documents
- Google Generative AI / Gemini
- PDF parsing
- Puppeteer for PDF generation

## Project Structure

```bash
ai-career-assistant/
├── backend/
│   ├── src/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm or yarn
- MongoDB instance or MongoDB Atlas connection string
- Google AI API key

### 1. Clone the repository

```bash
git clone https://github.com/Muhammad-Umair-80/ai-career-assistant.git
cd ai-career-assistant
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend/` folder with the following values:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_GENAI_API_KEY=your_google_ai_api_key
```

You may also use:

```env
MONGODB_URI_NON_SRV=your_non_srv_mongodb_uri
```

### 4. Start the application

Start the backend server:

```bash
cd backend
npm run dev
```

Start the frontend development server:

```bash
cd frontend
npm run dev
```

By default, the frontend is served by Vite and the backend runs on port 3000.

## Usage

1. Open the frontend in your browser.
2. Create an account or log in.
3. Paste the target job description.
4. Upload your resume PDF or provide your resume summary.
5. Add a short self-description.
6. Click "Generate Interview Report".
7. Review:
   - Match score
   - Technical and behavioral interview guidance
   - Skill gaps
   - Preparation roadmap
8. Download the generated resume PDF if needed.

## Example Workflow

A typical user flow looks like this:

- Upload resume
- Paste job description for a frontend/backend role
- Add career summary and recent experience
- AI creates a personalized report
- User reviews weak areas and prepares for interviews

## API Overview

The backend exposes authentication and interview-related routes including:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/logout`
- `POST /interview`
- `GET /interview/report/:interviewId`
- `GET /interview`
- `POST /interview/resume/pdf/:interviewId`

## Notes

This project is built as a practical AI-powered interview preparation tool for personal and professional use. It is especially useful for candidates preparing for technical interviews, career transitions, or role-specific optimization.

## Contributing

Contributions are welcome. If you would like to improve the app, feel free to:

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Open a pull request

## License

This project currently uses the ISC license in its package metadata. If needed, a dedicated `LICENSE` file can be added for clearer GitHub publishing.

## Author

Muhammad Umair

## Repository

https://github.com/Muhammad-Umair-80/ai-career-assistant

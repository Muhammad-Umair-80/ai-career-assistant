import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Replace with your backend API URL
    withCredentials: true, // Allow cookies to be sent
});


/**
 * @description Generate an interview report based on the provided job description, resume file, and self-description.
 * This function sends a POST request to the backend API endpoint '/auth/interview' with the necessary data.
 * It uses FormData to handle the file upload and other fields.
 * @param {*} jobDescription 
 * @param {*} resumeFile 
 * @param {*} selfDescription 
 * @returns 
 */
export const generateInterviewReport = async (jobDescription , resumeFile, selfDescription) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);
    formData.append('selfDescription', selfDescription);

    const response = await api.post('/auth/interview', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',

        },
    });
    return response.data;
}

/**
 * @description Get interview report by ID
 * @param {*} interviewId 
 * @returns 
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/auth/report/${interviewId}`);
    return response.data;
}

/**
 * @description Get all interview reports for the authenticated user
 * @returns 
 */
export const getAllInterviewReports = async () => {
    const response = await api.get('/auth');
    return response.data;
}

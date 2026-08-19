import axios from 'axios';

const api = axios.create({
    baseURL: (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) || 'http://localhost:3000',
    withCredentials: true, // Allow cookies to be sent
});

async function tryPostTwoPaths(pathAuth, pathPublic, formData, config) {
    try {
        const resp = await api.post(pathAuth, formData, config);
        return resp.data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            const resp2 = await api.post(pathPublic, formData, config);
            return resp2.data;
        }
        throw err;
    }
}


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
    if (resumeFile) formData.append('resumeFile', resumeFile);
    if (jobDescription) formData.append('jobDescription', jobDescription);
    if (selfDescription) formData.append('selfDescription', selfDescription);

    // Try authenticated endpoint first, fall back to public endpoint
    return await tryPostTwoPaths('/auth/interview', '/interview', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
}

/**
 * @description Get interview report by ID
 * @param {*} interviewId 
 * @returns 
 */
export const getInterviewReportById = async (interviewId) => {
    if (!interviewId) throw new Error('interviewId is required');
    try {
        const response = await api.get(`/interview/report/${interviewId}`);
        return response.data;
    } catch (err) {
        // Fallback to an auth-prefixed route if server uses that
        if (err.response && err.response.status === 404) {
            const response = await api.get(`/auth/interview/report/${interviewId}`);
            return response.data;
        }
        throw err;
    }
}

/**
 * @description Get all interview reports for the authenticated user
 * @returns 
 */
export const getAllInterviewReports = async () => {
    try {
        const response = await api.get('/interview');
        return response.data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            const response = await api.get('/auth/interview');
            return response.data;
        }
        throw err;
    }
}


export const generateResumePdf = async (interviewReportId) => {
    const response = await api.post(`/interview/resume/pdf/${interviewReportId}`, {}, {
        responseType: 'blob', // Expect a binary response (PDF)
    });
    return response.data; // This will be a Blob representing the PDF

};

export async function submitInterview({ resumeFile, resumeDescription, jobDescription, selfDescription }) {
    // If resumeFile provided, send multipart/form-data
    if (resumeFile) {
        const fd = new FormData();
        fd.append('resumeFile', resumeFile);
        if (jobDescription) fd.append('jobDescription', jobDescription);
        if (selfDescription) fd.append('selfDescription', selfDescription);
        return await tryPostTwoPaths('/auth/interview', '/interview', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    }

    // Otherwise send JSON
    const payload = { resumeDescription, jobDescription, selfDescription };
    try {
        const resp = await api.post('/interview', payload);
        return resp.data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            const resp2 = await api.post('/auth/interview', payload);
            return resp2.data;
        }
        throw err;
    }
}


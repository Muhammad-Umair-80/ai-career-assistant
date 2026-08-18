import axios from "axios"

// Allow overriding API base URL via environment variable (useful in development/containers)
// Guard against `process` being undefined in some browser/runtime setups (e.g. non-bundled environments).
const baseURL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL)
    || (typeof window !== 'undefined' && window.__env && window.__env.REACT_APP_API_URL)
    || "http://localhost:3000";

const api = axios.create({
    baseURL,
    withCredentials: true,
})

async function tryPostTwoPaths(pathAuth, pathPublic, body, config) {
    try {
        const resp = await api.post(pathAuth, body, config);
        return resp.data;
    } catch (err) {
        // If the auth path is not found, try the public path. For other errors, rethrow.
        if (err.response && err.response.status === 404) {
            try {
                const resp2 = await api.post(pathPublic, body, config);
                return resp2.data;
            } catch (err2) {
                // Enrich the error so caller has context which endpoint(s) failed.
                const message = `Both ${pathAuth} and ${pathPublic} requests failed. ` +
                    (err2.response?.data?.error || err2.message || `Status ${err2.response?.status}`);
                const enhanced = new Error(message);
                enhanced.original = err2;
                throw enhanced;
            }
        }
        throw err;
    }
}

export async function submitInterview({ resumeFile, resumeDescription, jobDescription, selfDescription }) {
    if (resumeFile) {
        const fd = new FormData();
        fd.append('resumeFile', resumeFile);
        if (jobDescription) fd.append('jobDescription', jobDescription);
        if (selfDescription) fd.append('selfDescription', selfDescription);

        return await tryPostTwoPaths('/auth/interview', '/interview', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
        const payload = { resumeDescription, jobDescription, selfDescription };
        return await tryPostTwoPaths('/auth/interview', '/interview', payload);
    }
}

export async function getInterviewReport(interviewId) {
    if (!interviewId) {
        throw new Error('Interview ID is required');
    }

    try {
        const response = await api.get(`/auth/interview/${interviewId}`);
        return response.data?.interviewReport ?? response.data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            const response = await api.get(`/interview/${interviewId}`);
            return response.data?.interviewReport ?? response.data;
        }
        throw err;
    }
}

export async function fetchResumePdf(interviewId) {
    if (!interviewId) {
        throw new Error('Interview ID is required');
    }
    // Backend exposes POST /interview/resume/pdf/:interviewId (protected). Use responseType 'blob' to receive binary PDF.
    try {
        const response = await api.post(`/interview/resume/pdf/${interviewId}`, null, { responseType: 'blob' });
        return response; // caller can read response.data (Blob) and response.headers
    } catch (err) {
        // If auth path exists in some deployments, try auth path as fallback
        if (err.response && err.response.status === 404) {
            const response = await api.post(`/auth/interview/resume/pdf/${interviewId}`, null, { responseType: 'blob' });
            return response;
        }
        throw err;
    }
}

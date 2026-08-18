import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

export async function submitInterview({ resumeFile, resumeDescription, jobDescription, selfDescription }) {
    if (resumeFile) {
        const fd = new FormData();
        fd.append('resumeFile', resumeFile);
        if (jobDescription) fd.append('jobDescription', jobDescription);
        if (selfDescription) fd.append('selfDescription', selfDescription);

        try {
            const resp = await api.post('/auth/interview', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            return resp.data;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                const resp2 = await api.post('/interview', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                return resp2.data;
            }
            throw err;
        }
    } else {
        const payload = { resumeDescription, jobDescription, selfDescription };
        try {
            const resp = await api.post('/auth/interview', payload);
            return resp.data;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                const resp2 = await api.post('/interview', payload);
                return resp2.data;
            }
            throw err;
        }
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

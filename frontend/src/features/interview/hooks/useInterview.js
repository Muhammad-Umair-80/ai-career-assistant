const {generateInterviewReport, getInterviewReportById, getAllInterviewReports} = require('../services/interview.api');
const {useContext, useState} = require('react');
const {InterviewContext} = require('../interview.context');


export const useInterview = () => {
    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider');
    }

    const {loading, setLoading, report, setReport, reports, setReports} = context;

    const generateReport = async (jobDescription, resumeFile, selfDescription) => {
        setLoading(true);
        let data= null;
        try {
            const data = await generateInterviewReport(jobDescription, resumeFile, selfDescription);
            setReport(data.interviewReport);
        } catch (error) {
            console.error('Error generating interview report:', error);
        } finally {
            setLoading(false);
        }

        return data.interviewReport;
    };

    const getReportById = async (interviewId) => {
    setLoading(true);
    let data = null;
    try {
        const data = await getInterviewReportById(interviewId);
        setReport(data.interviewReport);
    } catch (error) {
        console.error('Error fetching interview report by ID:', error);
    }
    finally {
        setLoading(false);
    }
    return data.interviewReport
}
const getAllReports = async () => {
    setLoading(true);   
    let data = null;
    try {
        const data = await getAllInterviewReports();
        setReports(data.interviewReports);
    } catch (error) {
        console.error('Error fetching all interview reports:', error);
    }   
    finally {
        setLoading(false);
    }
    return data.interviewReports;


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getAllReports
    }

}}
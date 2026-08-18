import { useContext } from 'react';
import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
  generateResumePdf,
} from '../services/interview.api';
import { InterviewContext } from '../interview.context';

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context;


  const generateReport = async (jobDescription, resumeFile, selfDescription) => {
    setLoading(true);
    try {
      const data = await generateInterviewReport(jobDescription, resumeFile, selfDescription);
      setReport(data?.interviewReport ?? null);
      return data?.interviewReport ?? null;
    } catch (error) {
      console.error('Error generating interview report:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const data = await getInterviewReportById(interviewId);
      setReport(data?.interviewReport ?? null);
      return data?.interviewReport ?? null;
    } catch (error) {
      console.error('Error fetching interview report by ID:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    setLoading(true);
    try {
      const data = await getAllInterviewReports();
      const nextReports = data?.interviewReports ?? [];
      setReports(nextReports);
      return nextReports;
    } catch (error) {
      console.error('Error fetching all interview reports:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getResumePdf = async (interviewId) => {
    if (!interviewId) return null;
    setLoading(true);
    try {
      // generateResumePdf returns a Blob (see services/interview.api.js)
      const blob = await generateResumePdf(interviewId);
      const filename = `resume-${interviewId}.pdf`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('Error downloading resume pdf:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getAllReports,
    getResumePdf,
  };
};

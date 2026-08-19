import { useContext, useEffect } from 'react';
import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
  generateResumePdf
} from '../services/interview.api';
import { InterviewContext } from '../interview.context';
import {useParams} from 'react-router';

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  const { interviewId } = useParams();

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

  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    let response = null
    try {
        response = await generateResumePdf(interviewReportId);
        const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `resume_${interviewReportId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    catch (error) {
        console.error('Error generating resume PDF:', error);
    } finally {
        setLoading(false);
    }

  }

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }else {
      setReport(null);
    }}, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getAllReports,
    getResumePdf 
  };
};

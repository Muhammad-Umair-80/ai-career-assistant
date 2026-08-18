import { createContext, useContext, useState } from 'react';

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);

  return (
    <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
      {children}
    </InterviewContext.Provider>
  );
};

export function useInterview() {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }

  return context;
}

export default InterviewProvider;


import {createContext, useContext, useState} from 'react';

const InterviewContext = createContext();

export const InterviewProvider = ({children}) => {

    const [loading, setLoading] = useState(false);
    const [report , setReport] = useState(false);
    const [reports , setReports] = useState([]);

    RETURN (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    );
}


import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/home.scss';
import { useInterview } from '../interview.context';
import { useAuth } from '../../auth/auth.context';

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="label-icon">
    <path d="M7 3.5h7.5L18.5 8v11.5a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14.5 3.5V8h4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8.2 11.8h7.6M8.2 15.3h7.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true" className="upload-icon-svg">
    <path d="M23 48.5h17.5A11.5 11.5 0 0 0 48 26.9a9.8 9.8 0 0 0-1.2-19.3A13.8 13.8 0 0 0 21 16.5a10.4 10.4 0 0 0 2 20.9Z" fill="currentColor" opacity="0.18"/>
    <path d="M21.8 45.5h20.4a10.2 10.2 0 0 0 .6-20.3 12.7 12.7 0 0 0-24.7 3.8A8.7 8.7 0 0 0 21.8 45.5Zm9.7-13.5v9h2.9v-9h5.3l-6.7-7.1-6.7 7.1h5.2Z" fill="currentColor"/>
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="spark-icon">
    <path d="M12 1.7 14.2 8l6.3 2.2-6.3 2.2L12 18.3l-2.2-5.9-6.3-2.2 6.3-2.2L12 1.7Z" fill="currentColor"/>
  </svg>
);

import { submitInterview } from './services/interview.api';

const Home = () => {
 const { reports, getAllReports } = useInterview();
 const { user } = useAuth();
 const [jobDescription, setJobDescription] = useState('');
 const [selfDescription, setSelfDescription] = useState('');
 const [resumeFile, setResumeFile] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(null);
 const fileInputRef = useRef(null);
 const navigate = useNavigate();

 async function handleGenerate() {
   setError(null);
   setSuccess(null);
   setLoading(true);
   try {
     const result = await submitInterview({ resumeFile, resumeDescription: null, jobDescription, selfDescription });
     console.log('generate result:', result);

     const interviewReport = result?.interviewReport ?? result;
     const interviewId = interviewReport?._id || interviewReport?.id;

     if (interviewId) {
       navigate(`/interview/${interviewId}`, {
         state: { report: interviewReport },
       });
       return;
     }

     setSuccess('Interview report generated successfully');
   } catch (err) {
     console.error('generate error', err);
     setError(err?.response?.data?.error || err.message || 'Failed to generate interview report');
   } finally {
     setLoading(false);
   }
 }

 // Load saved reports when the authenticated user is available
 React.useEffect(() => {
   let mounted = true;
   if (!user) return;
   (async () => {
     try {
       await getAllReports();
     } catch (err) {
       console.error('Failed to fetch reports:', err);
     }
   })();
   return () => { mounted = false; };
 }, [user]);

 function handleFileChange(e) {
   setError(null);
   const file = e.target.files && e.target.files[0];
   if (file) {
     // Basic client-side validation
     if (file.size > 10 * 1024 * 1024) {
       setError('File size exceeds 10MB limit');
       fileInputRef.current.value = '';
       setResumeFile(null);
       return;
     }
     setResumeFile(file);
   } else {
     setResumeFile(null);
   }
 }

 return (
   <main className="interview-page">
     <div className="page-content">
       <section className="hero">
         <h1>Prepare for Your Next Big Interview</h1>
         <p>
           Provide your target job description and your background details. Our AI mentor will
           generate a personalized preparation report to boost your confidence.
         </p>
       </section>

       <section className="form-panel">
         <div className="job-column">
           <label className="field-label" htmlFor="jobDescription">
             <DocumentIcon />
             <span>Job Description</span>
           </label>
           <textarea
             id="jobDescription"
             value={jobDescription}
             onChange={(e) => setJobDescription(e.target.value)}
             placeholder="Paste the full job description here..."
           />
         </div>

         <div className="side-column">
           <div className="upload-box">
             <div className="label-row">
               <label className="field-label" htmlFor="resumeUpload">
                 <DocumentIcon />
                 <span>Resume</span>
               </label>
               <small className="hint">(Use resume and self description together for best result)</small>
             </div>

             <label htmlFor="resumeUpload" className="upload-inner">
               <div className="upload-icon" aria-hidden="true">
                 <CloudUploadIcon />
               </div>
               <p>{resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}</p>
               <small>PDF, DOCX up to 10MB</small>
             </label>

             <input ref={fileInputRef} id="resumeUpload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
           </div>

           <div className="self-box">
             <label className="field-label" htmlFor="selfDescription">
               <DocumentIcon />
               <span>Self Description</span>
             </label>
             <textarea
               id="selfDescription"
               value={selfDescription}
               onChange={(e) => setSelfDescription(e.target.value)}
               placeholder="Briefly describe your key strengths, recent experiences, and what you are looking for..."
             />
           </div>

           <button className="generate-btn" type="button" onClick={handleGenerate} disabled={loading}>
             <SparkIcon />
             <span>{loading ? 'Generating…' : 'Generate Interview Report'}</span>
           </button>

            {/* recent report list*/}
            {user ? (
             reports.length > 0 ? (
               <div className="recent-reports">
                 <h3>Recent Reports</h3>
                 <ul className='reportlist'>
                   {reports.map((report) => (
                     <li key={report._id} className='report-item' onClick={()=> navigate(`/interview/${report._id}`)}>
                       <h3>{report.title || report.name || 'Untitled Report'}</h3>
                       <p className='report-meta'> Generated on {new Date(report.createdAt || report.CreatedAt || Date.now()).toLocaleDateString()} </p>
                       <p className={`match-score ${report.matchScore > 70 ? 'high' : report.matchScore > 50 ? 'medium' : 'low'}`}>
                         Match Score: {report.matchScore}%
                       </p>
                     </li>
                   ))}
                 </ul>
               </div>
             ) : (
               <div className="recent-reports">
                 <h3>Recent Reports</h3>
                 <p className="muted">No saved reports found for your account.</p>
               </div>
             )
            ) : (
             <div className="recent-reports">
               <h3>Recent Reports</h3>
               <p className="muted">Log in to view your saved interview reports.</p>
             </div>
            )}

           {/* page footer */}
           <footer className="footer">
              <p>
                Powered by <a href="https://openai.com/" target="_blank" rel="noopener noreferrer">OpenAI</a> and <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </p>
            </footer>

           {error && <div className="error">{error}</div>}
           {success && <div className="success">{success}</div>}
         </div>
       </section>
     </div>
   </main>
 )
}
export default Home;
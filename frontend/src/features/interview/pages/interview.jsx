import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview'
import { getInterviewReport } from './services/interview.api'

const Interview = ({ report: initialReport = null }) => {
  const location = useLocation();
  const { interviewId } = useParams();
  const [report, setReport] = useState(initialReport || location.state?.report || null);
  const {getResumePdf} = useInterview();
  const [loading, setLoading] = useState(!initialReport && !!interviewId);
  const [error, setError] = useState(null);

  useEffect(() => {
    const routeReport = location.state?.report || initialReport;
    if (routeReport) {
      setReport(routeReport);
      setLoading(false);
      setError(null);
      return;
    }

    if (!interviewId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchReport = async () => {
      setLoading(true);
      try {
        const fetchedReport = await getInterviewReport(interviewId);
        if (isMounted) {
          setReport(fetchedReport);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.error || err.message || 'Failed to load interview report');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReport();
    return () => {
      isMounted = false;
    };
  }, [initialReport, interviewId, location.state]);

  const r = report || {};
  const technical = r.technicalQuestions || [];
  const behavioral = r.behavioralQuestions || [];
  const preparations = r.preparations || [];
  const skillGaps = r.skillGaps || [];

  const [selectedQuestion, setSelectedQuestion] = useState(null); // { section: 'technical'|'behavioral', index }
  const [selectedPreparation, setSelectedPreparation] = useState(null); // index

  if (loading) {
    return (
      <div className="interview-page">
        <div className="page-content interview-container">
          <div className="panel">
            <h3>Loading your interview report...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interview-page">
        <div className="page-content interview-container">
          <div className="panel">
            <h3>Unable to load interview report</h3>
            <p className="muted">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-page">
      <div className="page-content interview-container">
        <div className="interview-layout">
          <aside className="left-col">
            <section className="panel">
              <h3>Technical Questions</h3>
              <ul className="qa-list">
                {technical.length === 0 ? (
                  <li className="muted">No technical questions</li>
                ) : (
                  technical.map((t, i) => (
                    <li key={i} className={`qa-item ${selectedQuestion?.section === 'technical' && selectedQuestion.index === i ? 'active' : ''}`} onClick={() => { setSelectedQuestion({ section: 'technical', index: i }); setSelectedPreparation(null); }} role="button" tabIndex={0}>
                      <strong>{t.question}</strong>
                    </li>
                  ))
                )}
              </ul>
            </section>
                
            <section className="panel">
              <h3>Behavioral Questions</h3>
              <ul className="qa-list">
                {behavioral.length === 0 ? (
                  <li className="muted">No behavioral questions</li>
                ) : (
                  behavioral.map((b, i) => (
                    <li key={i} className={`qa-item ${selectedQuestion?.section === 'behavioral' && selectedQuestion.index === i ? 'active' : ''}`} onClick={() => { setSelectedQuestion({ section: 'behavioral', index: i }); setSelectedPreparation(null); }} role="button" tabIndex={0}>
                      <strong>{b.question}</strong>
                    </li>
                  ))
                )}
              </ul>
            </section>
                
            <section className="panel">
              <h3>Road Map</h3>
              <ol className="roadmap">
                {preparations.length === 0 ? (
                  <li className="muted">No preparations</li>
                ) : (
                  preparations.map((p, i) => (
                    <li key={i} className={`prep-item ${selectedPreparation === i ? 'active' : ''}`} onClick={() => { setSelectedPreparation(i); setSelectedQuestion(null); }} role="button" tabIndex={0}>
                      <span className="day">Day {p.day}</span> <span className="focus">{p.focus}</span>
                    </li>
                  ))
                )}
              </ol>
              
            </section>

            
          </aside>

          <main className="main-col panel">
            <div className="main-inner">
              <div className="score">Match Score: <span className="score-value">{r.matchScore ?? '—'}</span></div>
              <div className="main-content">
                {selectedQuestion ? (
                  (() => {
                    const { section, index } = selectedQuestion;
                    const item = section === 'technical' ? technical[index] : behavioral[index];
                    return (
                      <div className="qa-detail">
                        <h2>{item.question}</h2>
                        {item.intension && <p className="intention"><strong>Intention:</strong> {item.intension}</p>}
                        {item.answer && <div className="answer"><h3>Suggested Answer</h3><p>{item.answer}</p></div>}
                      </div>
                    );
                  })()
                ) : selectedPreparation !== null ? (
                  (() => {
                    const p = preparations[selectedPreparation];
                    return (
                      <div className="prep-detail">
                        <h2>Day {p.day}: {p.focus}</h2>
                        <p>{p.task}</p>
                      </div>
                    );
                  })()
                ) : (
                  <>
                    <h2>Main Content</h2>
                    <p className="muted">This area is reserved for the detailed analysis, suggestions, or any larger piece of content you want to show from the report.</p>
                  </>
                )}
              </div>
            </div>
          </main>

          <aside className="right-col">
            <div className="panel">
              <h3>Skill Gaps</h3>
              <div className="gaps">
                {skillGaps.length === 0 ? <div className="muted">No gaps identified</div> : skillGaps.map((s, i) => (
                  <div className={`gap-pill severity-${s.severity || 'medium'}`} key={i}>{s.skill}</div>
                ))}
                
              </div>
              
            </div>
            <button 
            onClick={() => { getResumePdf(interviewId); }}
            className="button primary-button download-btn" disabled={!interviewId} >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1    
  0-.708.708l3 3z"/>
              </svg>
              Download resume</button>
          </aside>
          
        </div>
      </div>
    </div>
  )
}

export default Interview

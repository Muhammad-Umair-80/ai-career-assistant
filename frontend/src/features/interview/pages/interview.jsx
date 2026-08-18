import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import '../style/interview.scss'
import { getInterviewReport } from './services/interview.api'

const Interview = ({ report: initialReport = null }) => {
  const location = useLocation();
  const { interviewId } = useParams();
  const [report, setReport] = useState(initialReport || location.state?.report || null);
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
                {technical.length === 0 ? <li className="muted">No technical questions</li> : technical.map((t, i) => (
                  <li key={i}>
                    <strong>{t.question}</strong>
                    <p className="intention">{t.intension}</p>
                    <p className="answer">{t.answer}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <h3>Behavioral Questions</h3>
              <ul className="qa-list">
                {behavioral.length === 0 ? <li className="muted">No behavioral questions</li> : behavioral.map((b, i) => (
                  <li key={i}>
                    <strong>{b.question}</strong>
                    <p className="intention">{b.intension}</p>
                    <p className="answer">{b.answer}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <h3>Road Map</h3>
              <ol className="roadmap">
                {preparations.length === 0 ? <li className="muted">No preparations</li> : preparations.map((p, i) => (
                  <li key={i}><span className="day">Day {p.day}</span> <span className="focus">{p.focus}:</span> <span className="task">{p.task}</span></li>
                ))}
              </ol>
            </section>
          </aside>

          <main className="main-col panel">
            <div className="main-inner">
              <div className="score">Match Score: <span className="score-value">{r.matchScore ?? '—'}</span></div>
              <div className="main-content">
                <h2>Main Content</h2>
                <p className="muted">This area is reserved for the detailed analysis, suggestions, or any larger piece of content you want to show from the report.</p>
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
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Interview

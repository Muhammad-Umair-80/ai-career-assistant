import { useState, useEffect } from 'react';

// Minimal scaffold for useInterview hook to avoid runtime import errors.
// Expand this hook later to provide fetching, caching, and state management for interview reports.
export function useInterview() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // placeholder — no-op
  }, []);

  return { report, setReport, loading, error, setError, setLoading };
}

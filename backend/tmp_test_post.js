const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
(async () => {
  try {
    const res = await fetch('http://localhost:3000/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeDescription: 'Experienced software engineer with 5 years in Node.js, Express and MongoDB. Worked on REST APIs and PDF processing.',
        jobDescription: 'Senior Backend Engineer: Strong Node.js, Docker, and MongoDB skills required.',
        selfDescription: 'I like system design and backend engineering.'
      })
    });
    console.log('STATUS', res.status);
    const txt = await res.text();
    console.log(txt);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
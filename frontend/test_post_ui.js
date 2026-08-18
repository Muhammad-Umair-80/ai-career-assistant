const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
(async ()=>{
  try {
    const res = await fetch('http://localhost:3000/auth/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeDescription: 'UI test resume', jobDescription: 'UI test job', selfDescription: 'UI test self' })
    });
    console.log('STATUS', res.status);
    const txt = await res.text();
    console.log(txt.slice(0,2000));
  } catch (e) { console.error(e); process.exit(1) }
})();
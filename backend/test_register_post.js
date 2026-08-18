const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
(async ()=>{
  try {
    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'ui_test_user', email: 'ui_test@example.com', password: 'testpass' })
    });
    console.log('STATUS', res.status);
    const txt = await res.text();
    console.log(txt);
  } catch (e) { console.error(e); process.exit(1) }
})();
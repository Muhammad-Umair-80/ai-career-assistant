try {
  const app = require('./src/app');
  console.log('app type:', typeof app);
  console.log('app keys:', Object.keys(app || {}));
  console.log('app instanceof Function:', app instanceof Function);
  console.log('app._router exists?', !!(app && app._router));
  if (app && app.router) {
    try { console.log('app.router.stack length:', app.router.stack && app.router.stack.length); } catch(e) { }
  }
} catch (err) {
  console.error('ERROR requiring app:', err);
}

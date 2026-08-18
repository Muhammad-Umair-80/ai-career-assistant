const app = require('./src/app');
console.log('app.router.stack entries:');
(app.router.stack || []).forEach((m, i) => {
  try {
    console.log(i, 'name:', m.name, 'regexp:', m.regexp && m.regexp.source);
    console.log('      route:', m.route ? Object.keys(m.route.methods).join(',').toUpperCase() + ' ' + m.route.path : 'n/a');
    if (m.handle && m.handle.stack) {
      m.handle.stack.forEach((h, j) => {
        console.log('   ', i + '.' + j, h.route ? Object.keys(h.route.methods).join(',').toUpperCase() + ' ' + h.route.path : (h.name || h.regexp && h.regexp.source));
      });
    }
  } catch(e) { console.log('err printing', e); }
});

require('dotenv').config();
const connectDB = require('./src/config/database');
const authController = require('./src/controllers/auth.controller');
(async ()=>{
  try{
    await connectDB();
    const req = { body: { email: 'postman@example.com', password: 'TestPass123' } };
    const res = {
      _cookies: {},
      status(code){ this._status = code; return this; },
      cookie(name, value, opts){ this._cookies[name] = { value, opts }; },
      clearCookie(name){ delete this._cookies[name]; },
      json(obj){ console.log('RESP status', this._status || 200, 'body:', obj, 'cookies:', this._cookies); }
    };
    await authController.loginUser(req, res);
    process.exit(0);
  }catch(e){ console.error(e); process.exit(1)}
})();
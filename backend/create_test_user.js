require('dotenv').config();
const connectDB = require('./src/config/database');
const User = require('./src/models/user.model');
const bcrypt = require('bcrypt');
(async ()=>{
  try{
    await connectDB();
    const hashed = await bcrypt.hash('TestPass123', 10);
    const u = await User.create({ username: 'postman_user', email: 'postman@example.com', password: hashed });
    console.log('Created user id:', u._id.toString());
    process.exit(0);
  }catch(e){
    console.error('ERR', e);
    process.exit(1);
  }
})();
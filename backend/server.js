require ('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');


async function bootstrap() {
  await connectDB();

  
  
 

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}

bootstrap().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});

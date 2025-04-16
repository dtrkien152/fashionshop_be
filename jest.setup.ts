import dotenv from 'dotenv';

// Load file môi trường test
dotenv.config({ path: '.env.test' });

console.log('✅ Loaded .env.test for testing');

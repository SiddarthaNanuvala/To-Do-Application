import dotenv from 'dotenv';

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  // Add any global setup here
});

// Global test cleanup
afterAll(async () => {
  // Add any global cleanup here
}); 
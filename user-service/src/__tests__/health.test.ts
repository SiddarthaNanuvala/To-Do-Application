import request from 'supertest';
import express from 'express';
import healthRoutes from '../routes/health';
import sequelize from '../database';

const app = express();
app.use('/', healthRoutes);

describe('Health Check Endpoint', () => {
  beforeAll(async () => {
    // Ensure database is connected before tests
    await sequelize.authenticate();
  });

  it('should return 200 and healthy status when database is connected', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('database', 'connected');
    expect(response.body).toHaveProperty('timestamp');
  });
}); 
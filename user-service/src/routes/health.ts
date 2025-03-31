import { Router } from 'express';
import sequelize from '../database';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

export default router; 
import { Router } from 'express';
import config from './config/config';
import authRoutes from './server/routes/auth.route';
import userRoutes from './server/routes/user.route';

const router = Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

// Routes used for tests ONLY
if (config.env !== 'production') {
  // eslint-disable-next-line global-require
  router.use('/test', require('./server/routes/test.routes').default);
}

export default router;

import express from 'express';
import versionRouter from '../middlewares/versionRouter';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/version-router/multi', versionRouter({
  10: [(req, res) => res.json({ message: 'handler>10' })],
  otherwise: [(req, res) => res.json({ message: 'handler<=10' })],
}));
router.get('/version-router/default', versionRouter({
  otherwise: [(req, res) => res.json({ message: 'default-handler' })],
}));

export default router;

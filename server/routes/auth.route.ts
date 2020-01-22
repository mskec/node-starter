import express from 'express';
import authCtrl from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import validateMiddleware from '../middlewares/validate.middleware';
import validationSchema from './validations/auth.validation';

const router = express.Router();

router.route('/login')
  .post(validateMiddleware(validationSchema.login), authCtrl.login);

router.route('/registration')
  .post(validateMiddleware(validationSchema.registration), authCtrl.registration);

router.route('/token-refresh')
  .post(authMiddleware({ ignoreExpiration: true }), authCtrl.tokenRefresh);

router.route('/token-blacklist')
  .post(validateMiddleware(validationSchema.tokenBlacklist), authCtrl.tokenBlacklist);


export default router;

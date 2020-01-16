import express from 'express';
import validate from 'express-validation';
import authMiddleware from '../helpers/authMiddleware';
import paramValidation from './validations/auth.validation';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

router.route('/registration')
  .post(validate(paramValidation.registration), authCtrl.registration);

router.route('/token-refresh')
  .post(authMiddleware({ ignoreExpiration: true }), authCtrl.tokenRefresh);

export default router;

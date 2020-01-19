import express from 'express';
import { celebrate as validate } from 'celebrate';
import authMiddleware from '../helpers/authMiddleware';
import paramValidation from './validations/auth.validation';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/login')
  .post(validate(paramValidation.login, { abortEarly: false }), authCtrl.login);

router.route('/registration')
  .post(validate(paramValidation.registration, { abortEarly: false }), authCtrl.registration);

router.route('/token-refresh')
  .post(authMiddleware({ ignoreExpiration: true }), authCtrl.tokenRefresh);

router.route('/token-blacklist')
  .post(validate(paramValidation.tokenBlacklist, { abortEarly: false }), authCtrl.tokenBlacklist);


export default router;

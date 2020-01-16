import express from 'express';
import { celebrate as validate } from 'celebrate';
import authMiddleware from '../helpers/authMiddleware';
import userCtrl from '../controllers/user.controller';
import paramValidation from './validations/user.validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .all(authMiddleware())

  /** GET /api/user - Get user's profile */
  .get(userCtrl.get)

  /** PATCH /api/user - Update a user */
  .patch(validate(paramValidation.updateUser, { abortEarly: false }), userCtrl.update);

export default router;

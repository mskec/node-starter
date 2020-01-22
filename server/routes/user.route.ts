import express from 'express';
import userCtrl from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import validateMiddleware from '../middlewares/validate.middleware';
import validationSchema from './validations/user.validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .all(authMiddleware())

  /** GET /api/user - Get user's profile */
  .get(userCtrl.get)

  /** PATCH /api/user - Update a user */
  .patch(validateMiddleware(validationSchema.updateUser), userCtrl.update);

router.route('/password')
  /** POST /api/user/password - Change user's password */
  .post(authMiddleware(), validateMiddleware(validationSchema.passwordChange), userCtrl.passwordChange);

export default router;

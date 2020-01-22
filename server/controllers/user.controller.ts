import httpStatus from 'http-status';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import APIError from '../helpers/APIError';
import User from '../models/user.model';

/** Get user's profile */
async function get(req, res, next) {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      throw new APIError({ status: httpStatus.NOT_FOUND, isPublic: true });
    }

    res.json(User.format(user));
  } catch (e) {
    next(e);
  }
}

/** Update current user */
async function update(req, res, next) {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      throw new APIError({ status: httpStatus.NOT_FOUND, isPublic: true });
    }

    const dataToUpdate = _.pick(req.body, ['displayName']);
    if (!Object.keys(dataToUpdate).length) {
      throw new APIError({ status: httpStatus.BAD_REQUEST, isPublic: true });
    }

    const updatedUser = await user.update(dataToUpdate);
    res.json(User.format(updatedUser));
  } catch (e) {
    next(e);
  }
}

/** Changes user's password */
async function passwordChange(req, res, next) {
  try {
    const { user: { user_id: userId }, body: { password, oldPassword } } = req;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      throw new APIError({ status: httpStatus.BAD_REQUEST, isPublic: true });
    }

    await user.update({ password });
    res.status(httpStatus.OK).json();
  } catch (e) {
    next(e);
  }
}

export default {
  get,
  update,
  passwordChange,
};

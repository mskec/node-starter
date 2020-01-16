import Joi from '../../helpers/joi';

export default {
  // PATCH /api/user
  updateUser: {
    body: {
      displayName: Joi.string().max(255).min(5),
    },
  },
};

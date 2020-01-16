import Joi from '../../helpers/joi';

export default {
  // POST /api/auth/registration
  registration: {
    body: {
      email: Joi.string().max(255).email().required(),
      displayName: Joi.string().max(255).min(5),
      password: Joi.string().password(2).required(),
    },
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().max(255).email().required(),
      password: Joi.string().required(),
    },
  },
};

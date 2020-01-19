import { Segments } from 'celebrate';
import Joi from '../../helpers/joi';

export default {
  // POST /api/auth/registration
  registration: {
    [Segments.BODY]: {
      email: Joi.string().max(255).email().required(),
      displayName: Joi.string().max(255).min(5),
      password: Joi.string().password(2).required(),
    },
  },

  // POST /api/auth/login
  login: {
    [Segments.BODY]: {
      email: Joi.string().max(255).email().required(),
      password: Joi.string().required(),
    },
  },

  // POST /api/auth/token-blacklist
  tokenBlacklist: {
    [Segments.BODY]: {
      jti: Joi.string().max(10).required(),
    },
  },
};

import { Segments } from 'celebrate';
import Joi from '../../helpers/joi';

export default {
  // PATCH /api/user
  updateUser: {
    [Segments.BODY]: {
      displayName: Joi.string().max(255).min(5),
    },
  },
};

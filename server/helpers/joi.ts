import BaseJoi from 'joi';
import zxcvbn from 'zxcvbn';

function password(joi: BaseJoi.Root): BaseJoi.Extension {
  return {
    name: 'string',
    base: joi.string(),
    language: {
      password: 'must be stronger',
    },
    rules: [{
      name: 'password',
      params: {
        minScore: BaseJoi.number().required().min(0).max(4),
      },
      validate(params, value, state, options) {
        const result = zxcvbn(value);
        if (result.score < params.minScore) {
          return this.createError('string.password', { value }, state, options);
        }

        return value;
      },
    }],
  };
}

export default BaseJoi
  .extend(
    password,
  );

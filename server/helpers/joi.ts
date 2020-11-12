import { Joi } from 'celebrate';
import zxcvbn from 'zxcvbn';

function password(joi) {
  return {
    type: 'string',
    base: joi.string(),
    messages: {
      'string.password': '{{#label}} must be stronger',
    },
    rules: {
      password: {
        args: [{
          name: 'minScore',
          assert: value => typeof value === 'number' && value >= 0 && value <= 4,
          message: 'must be between 0 and 4',
        }],
        method(minScore) {
          // @ts-ignore
          return this.$_addRule({ name: 'password', args: { minScore }, errorCode: 'string.password' });
        },
        validate(value, helpers, args) {
          const result = zxcvbn(value);
          if (result.score < args.minScore) {
            return helpers.error('string.password');
          }

          return value;
        },
      },
    },
  };
}

export default Joi
  .extend(
    password,
  );

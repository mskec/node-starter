import { celebrate as validate } from 'celebrate';

export default schema => validate(schema, { abortEarly: false });

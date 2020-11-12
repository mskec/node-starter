/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';
import User from '../models/user.model';
import { signUserToken } from '../controllers/auth.controller';

function createUser(userData?): Promise<User> {
  const dummyData = {
    password: 'very_hard_to_break_password_1947201',
    email: faker.internet.email().toLowerCase(),
  };
  return User.create({ ...dummyData, ...userData });
}

async function createUserAndToken(userData?): Promise<{ user: User, token: string }> {
  const user = await createUser(userData);
  return { user, token: signUserToken(user) };
}

export default {
  createUser,
  createUserAndToken,
};

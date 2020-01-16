import _ from 'lodash';
import bcrypt from 'bcryptjs';
import Sequelize from 'sequelize';
import database from '../database';

const SALT_ROUNDS = 10;

export type UserRole = 'user' | 'admin';

// Model definition: https://docs.sequelizejs.com/manual/tutorial/models-definition.html
class User extends Sequelize.Model {
  static format = user => _.pick(
    user,
    [
      'id', 'displayName', 'email', 'role', 'isEmailVerified',
      'createdAt', 'updatedAt',
    ],
  );

  public id: string;
  public displayName: string;
  public email: string;
  public isEmailVerified: boolean;
  public role: UserRole;
  public password: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
User.init({
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  displayName: { type: Sequelize.STRING, allowNull: true },
  email: {
    type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true },
  },
  isEmailVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
  role: { type: Sequelize.ENUM('user', 'admin'), defaultValue: 'user' },
  password: { type: Sequelize.STRING(60), allowNull: false },
}, {
  sequelize: database,
  modelName: 'user',
  underscored: true,
});

/* eslint-disable no-param-reassign */
const formatFields = (user, opts) => { // eslint-disable-line consistent-return
  // Hash user's password
  if (opts.fields.includes('password')) {
    return bcrypt.hash(user.password, SALT_ROUNDS)
      .then(hashedPassword => {
        user.password = hashedPassword;
      });
  }
};
/* eslint-enable no-param-reassign */

User.beforeCreate(formatFields);
User.beforeUpdate(formatFields);

export default User;

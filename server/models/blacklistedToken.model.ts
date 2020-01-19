import Sequelize from 'sequelize';
import database from '../database';

// Model definition: https://docs.sequelizejs.com/manual/tutorial/models-definition.html
class BlacklistedToken extends Sequelize.Model {
  public jti: string;
  public readonly createdAt!: Date;
}
BlacklistedToken.init({
  jti: { type: Sequelize.STRING(7), primaryKey: true },
}, {
  sequelize: database,
  modelName: 'blacklisted_token',
  underscored: true,
  updatedAt: false,
});

export default BlacklistedToken;

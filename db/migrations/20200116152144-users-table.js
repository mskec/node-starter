module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    display_name: { type: Sequelize.STRING, allowNull: true, unique: true },
    email: {
      type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true },
    },
    is_email_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
    role: { type: Sequelize.ENUM(['user', 'admin']), defaultValue: 'user' },
    password: { type: Sequelize.STRING(60), allowNull: false },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  }),

  down: queryInterface => queryInterface.dropTable('users'),
};

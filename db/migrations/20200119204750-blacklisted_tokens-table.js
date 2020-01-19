module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('blacklisted_tokens', {
    jti: { type: Sequelize.STRING(7), primaryKey: true },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  }),

  down: queryInterface => queryInterface.dropTable('blacklisted_tokens'),
};

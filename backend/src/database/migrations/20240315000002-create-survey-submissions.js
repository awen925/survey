const sequelize = require('sequelize');
const DataTypes = sequelize.DataTypes;

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('survey_submissions', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('survey_submissions');
  },
}; 
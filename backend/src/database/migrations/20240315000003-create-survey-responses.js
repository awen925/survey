const sequelize = require('sequelize');
const DataTypes = sequelize.DataTypes;

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('survey_responses', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      submissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'survey_submissions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      answer: {
        type: DataTypes.JSONB,
        allowNull: false,
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

    // Add indexes
    await queryInterface.addIndex('survey_responses', ['submissionId']);
    await queryInterface.addIndex('survey_responses', ['questionId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('survey_responses');
  },
}; 
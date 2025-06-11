import { Sequelize } from 'sequelize';
import sequelize from '../config/database';
import Question from './Question';
import SurveySubmission from './SurveySubmission';
import SurveyResponse from './SurveyResponse';

const models = {
  Question,
  SurveySubmission,
  SurveyResponse,
};

// Initialize associations
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Sync all models with database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized');
}).catch((error: Error) => {
  console.error('Error synchronizing database:', error);
});

export {
  sequelize,
  Sequelize,
  Question,
  SurveySubmission,
  SurveyResponse,
}; 
import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database';
import Question from './Question';

class SurveySubmission extends Model<InferAttributes<SurveySubmission>, InferCreationAttributes<SurveySubmission>> {
  declare id: CreationOptional<number>;
  declare submittedAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  public static associate(models: any) {
    SurveySubmission.hasMany(models.SurveyResponse, {
      foreignKey: 'submissionId',
      as: 'responses'
    });
  }
}

SurveySubmission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
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
  },
  {
    sequelize,
    tableName: 'survey_submissions',
  }
);

export default SurveySubmission; 
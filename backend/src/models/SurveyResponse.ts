import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

class SurveyResponse extends Model<InferAttributes<SurveyResponse>, InferCreationAttributes<SurveyResponse>> {
  declare id: CreationOptional<number>;
  declare submissionId: number;
  declare questionId: number;
  declare answer: any;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  public static associate(models: any) {
    SurveyResponse.belongsTo(models.SurveySubmission, {
      foreignKey: 'submissionId',
      as: 'submission'
    });
    SurveyResponse.belongsTo(models.Question, {
      foreignKey: 'questionId',
      as: 'question'
    });
  }
}

SurveyResponse.init(
  {
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
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id',
      },
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
  },
  {
    sequelize,
    tableName: 'survey_responses',
  }
);

export default SurveyResponse; 
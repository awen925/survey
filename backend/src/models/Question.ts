import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ModelStatic } from 'sequelize';
import sequelize from '../config/database';

class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare type: string;
  declare options: any;
  declare required: boolean;
  declare order: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  public static associate(models: { [key: string]: ModelStatic<Model> }) {
    Question.hasMany(models.SurveyResponse, {
      foreignKey: 'questionId',
      as: 'responses'
    });
  }
}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: 'questions',
  }
);

export default Question; 
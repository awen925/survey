"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class SurveyResponse extends sequelize_1.Model {
    static associate(models) {
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
SurveyResponse.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    submissionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'survey_submissions',
            key: 'id',
        },
    },
    questionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id',
        },
    },
    answer: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: 'survey_responses',
});
exports.default = SurveyResponse;

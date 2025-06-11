"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyResponse = exports.SurveySubmission = exports.Question = exports.Sequelize = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
const database_1 = __importDefault(require("../config/database"));
exports.sequelize = database_1.default;
const Question_1 = __importDefault(require("./Question"));
exports.Question = Question_1.default;
const SurveySubmission_1 = __importDefault(require("./SurveySubmission"));
exports.SurveySubmission = SurveySubmission_1.default;
const SurveyResponse_1 = __importDefault(require("./SurveyResponse"));
exports.SurveyResponse = SurveyResponse_1.default;
const models = {
    Question: Question_1.default,
    SurveySubmission: SurveySubmission_1.default,
    SurveyResponse: SurveyResponse_1.default,
};
// Initialize associations
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});
// Sync all models with database
database_1.default.sync({ alter: true }).then(() => {
    console.log('Database synchronized');
}).catch((error) => {
    console.error('Error synchronizing database:', error);
});

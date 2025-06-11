"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const router = express_1.default.Router();
// Get all questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await models_1.Question.findAll({
            order: [['order', 'ASC']]
        });
        res.json(questions);
    }
    catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});
// Submit survey responses
router.post('/submit', async (req, res) => {
    const { responses } = req.body;
    if (!Array.isArray(responses)) {
        return res.status(400).json({ error: 'Invalid request format' });
    }
    const transaction = await models_1.sequelize.transaction();
    try {
        // Create survey submission
        const submission = await models_1.SurveySubmission.create({
            submittedAt: new Date()
        }, { transaction });
        // Create survey responses
        await Promise.all(responses.map(response => models_1.SurveyResponse.create({
            submissionId: submission.id,
            questionId: response.questionId,
            answer: response.answer
        }, { transaction })));
        await transaction.commit();
        res.json({ message: 'Survey submitted successfully', submissionId: submission.id });
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error submitting survey:', error);
        res.status(500).json({ error: 'Failed to submit survey' });
    }
});
// Get survey results
router.get('/results', async (req, res) => {
    try {
        const submissions = await models_1.SurveySubmission.findAll({
            include: [{
                    model: models_1.SurveyResponse,
                    as: 'responses',
                    include: [{
                            model: models_1.Question,
                            as: 'question'
                        }]
                }],
            order: [['submittedAt', 'DESC']]
        });
        res.json(submissions);
    }
    catch (error) {
        console.error('Error fetching survey results:', error);
        res.status(500).json({ error: 'Failed to fetch survey results' });
    }
});
exports.default = router;

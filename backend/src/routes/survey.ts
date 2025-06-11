import { Router, Request, Response } from 'express';
import { Question, SurveySubmission, SurveyResponse, sequelize } from '../models';

const router = Router();

// Get all questions
router.get('/questions', async (req: Request, res: Response) => {
  try {
    const questions = await Question.findAll({
      order: [['order', 'ASC']]
    });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Submit survey responses
router.post('/submit', async (req: Request, res: Response): Promise<void> => {
  const { responses } = req.body;

  if (!Array.isArray(responses)) {
    res.status(400).json({ error: 'Invalid request format' });
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    // Create survey submission
    const submission = await SurveySubmission.create({
      submittedAt: new Date()
    }, { transaction });

    // Create survey responses
    await Promise.all(responses.map(response => 
      SurveyResponse.create({
        submissionId: submission.id,
        questionId: response.questionId,
        answer: response.answer
      }, { transaction })
    ));

    await transaction.commit();
    res.json({ message: 'Survey submitted successfully', submissionId: submission.id });
  } catch (error) {
    await transaction.rollback();
    console.error('Error submitting survey:', error);
    res.status(500).json({ error: 'Failed to submit survey' });
  }
});

// Get survey results
router.get('/results', async (req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await SurveySubmission.findAll({
      include: [{
        model: SurveyResponse,
        as: 'responses',
        include: [{
          model: Question,
          as: 'question'
        }]
      }],
      order: [['submittedAt', 'DESC']]
    });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching survey results:', error);
    res.status(500).json({ error: 'Failed to fetch survey results' });
  }
});

export default router; 
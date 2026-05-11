import express from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { deleteQuiz, getQuizById, getQuizResults, getQuizzes, submitQuiz } from '../controllers/quiz.controller.js';
const quizRouter = express.Router();

quizRouter.use(authorize)

quizRouter.get('/:documentId', getQuizzes);
quizRouter.get('/quiz/:id', getQuizById);
quizRouter.post('/:id/submit', submitQuiz);
quizRouter.get('/:id/results', getQuizResults);
quizRouter.delete('/:id', deleteQuiz);

export default quizRouter;
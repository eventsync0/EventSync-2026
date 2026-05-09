import { Router } from 'express';
import * as QuestionController from '../controllers/question.controller';

const router = Router();
router.get('/sessions/:sessionId/questions', QuestionController.getBySession);
router.post('/questions', QuestionController.create);
router.post('/questions/:id/upvote', QuestionController.upvote);

export default router;
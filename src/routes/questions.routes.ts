import { Router } from 'express';
import * as QuestionController from '../controllers/question.controller';
import { authMiddleware } from '../middlewares/admin.middleware';

const router = Router();

router.get('/sessions/:sessionId/questions', QuestionController.getBySession);

router.post('/questions', authMiddleware, QuestionController.create);
router.post('/questions/:id/upvote', authMiddleware, QuestionController.upvote);

export default router;
import { Router } from 'express';
import * as QuestionController from '../controllers/question.controller';

const router = Router();

router.post('/', QuestionController.create);

router.post('/:id/upvote', QuestionController.upvote);

export default router;
import { Router } from 'express';
import { getConversation } from '../../controllers/tweets.controller';

const router = Router();

router.get("/conversations", getConversation);

export default router;
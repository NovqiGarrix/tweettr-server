import { Router } from 'express';
import tweetsRoutes from './tweets.v1.routes';

const router = Router();

router.use("/tweets", tweetsRoutes);

export default router;
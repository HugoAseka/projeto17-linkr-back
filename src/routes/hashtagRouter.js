import { Router } from 'express';
import { getHashtagPost, getHashtagRanking } from '../controllers/hashtagController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';


const hashtagRouter = Router();

hashtagRouter.get("/hashtag/:hashtag", checkAuth, getHashtagPost);
hashtagRouter.get("/ranking", getHashtagRanking);

export default hashtagRouter;
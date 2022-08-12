import { Router } from 'express';
import { getHashtagPost } from '../controllers/hashtagController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';


const hashtagRouter = Router();

hashtagRouter.get("/hashtag/:hashtag", checkAuth, getHashtagPost);

export default hashtagRouter;
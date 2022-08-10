import { getAllPosts, insertPost } from "../controllers/postsController.js";
import { Router } from "express";
import { checkAuth } from "../middlewares/authMiddleware.js";


const postsRouter = Router();

postsRouter.get("/posts",getAllPosts);
postsRouter.post("/posts", checkAuth, insertPost);

export default postsRouter;

import { getAllPosts, insertPost, updateLike } from "../controllers/postsController.js";
import { Router } from "express";
import { checkAuth } from "../middlewares/authMiddleware.js";


const postsRouter = Router();

postsRouter.get("/posts",getAllPosts);
postsRouter.post("/posts", checkAuth, insertPost);
postsRouter.put("/like/:id",checkAuth, updateLike);

export default postsRouter;

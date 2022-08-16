import { getAllPosts, insertPost, updateLike } from "../controllers/postsController.js";
import { Router } from "express";
import { checkAuth } from "../middlewares/authMiddleware.js";


const postsRouter = Router();

postsRouter.get("/posts",checkAuth,getAllPosts);
postsRouter.post("/posts", checkAuth, insertPost);
postsRouter.put("/like/:id", updateLike);

export default postsRouter;

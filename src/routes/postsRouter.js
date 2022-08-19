import { comments, deletePost, editPost, getAllPosts, insertPost, repost, updateLike } from "../controllers/postsController.js";
import { Router } from "express";
import { checkAuth } from "../middlewares/authMiddleware.js";
import { postValidator } from "../middlewares/postValidator.js";
import { commentValidation } from "../middlewares/commentMiddleware.js";


const postsRouter = Router();

postsRouter.get("/posts",checkAuth,getAllPosts);
postsRouter.post("/posts", checkAuth, insertPost);
postsRouter.put("/like/:id",checkAuth, updateLike);
postsRouter.delete("/posts/:id", checkAuth, deletePost);
postsRouter.put("/posts/:id", checkAuth, postValidator.updatePostValidator, editPost);
postsRouter.post("/repost/:postId", checkAuth, repost); 
postsRouter.post("/comments/:postId", checkAuth, commentValidation ,comments);

export default postsRouter;

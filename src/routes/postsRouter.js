import { getAllPosts, insertPost } from "../controllers/postsController.js";
import { Router } from "express";


const postsRouter = Router();

postsRouter.get("/posts",getAllPosts);
postsRouter.post("/posts", insertPost);

export default postsRouter;

import { postSchema } from "../schemas/postsSchema.js";
import { postRepository } from "../repositories/postsRepository.js";

export async function getAllPosts(req, res) {}

export async function insertPost(req, res) {
  const  Authorization  = req.headers.authorization;
  const token = Authorization?.replace("Bearer ", "");
  const newPost = req.body;
  const { error } = postSchema.validate(newPost);
  

  if (error) {
    return res.sendStatus(400);
  }

  await postRepository.createPost(token, newPost);
  res.sendStatus(200);
}

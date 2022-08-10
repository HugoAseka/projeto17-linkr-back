import { postSchema } from "../schemas/postsSchema.js";
import { postRepository } from "../repositories/postsRepository.js";

export async function getAllPosts(req, res) {
  const { rows: posts } = await postRepository.selectPosts();
  return res.status(200).send(posts);
}

export async function insertPost(req, res) {
  const token = res.locals.token;
  const newPost = req.body;
  const { error } = postSchema.validate(newPost);

  if (error) {
    return res.sendStatus(400);
  }

  await postRepository.createPost(token, newPost);
  res.sendStatus(200);
}

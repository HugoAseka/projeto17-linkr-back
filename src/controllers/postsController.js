import { postSchema } from "../schemas/postsSchema.js";
import { postRepository } from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function getAllPosts(req, res) {
  const { rows: posts } = await postRepository.selectPosts();
  return res.status(200).send(posts);
}

export async function insertPost(req, res) {
  const Authorization = req.headers.authorization;
  const token = Authorization?.replace("Bearer ", "");
  const newPost = req.body;
  const { error } = postSchema.validate(newPost);
  let values = {};
  if (error) {
    return res.sendStatus(400);
  }

  await postRepository.createPost(token, newPost);
  
  const x = urlMetadata(newPost.url).then(
    function ({ title, image, description }) {
      // success handler
      res.status(200).json({ title, description, image });
    },
    function (error) {
      // failure handler
      return res.sendStatus(500);
    }
  );
}

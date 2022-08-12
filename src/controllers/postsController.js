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

export async function updateLike(req,res) {
  const postId = req.params.id;
  const likeDislike = req.body.postLiked; 
  const userId = res.locals.userId; 

  try {
    const { rows: postExist } = await postRepository.existPost(postId);
    if(postExist.length===0) { 
      return res.sendStatus(404);
    }
    if(likeDislike==="like") { 
      await postRepository.likePost(userId,postId);
      return res.send("Like").status(200);
    } else { 
        await postRepository.dislikePost(userId,postId);
        return res.send("Dislike").status(204);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

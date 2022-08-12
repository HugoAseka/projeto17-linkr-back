import { postSchema } from "../schemas/postsSchema.js";
import { postRepository } from "../repositories/postsRepository.js";
import connection from "../db/database.js";

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
  const { likeDislike } = req.body; 
  const userId = res.locals.userId; 

  try {
    const { rows: postExist } = await connection.query('SELECT * FROM posts WHERE id= $1',[postId]);
    if(postExist.length===0) { 
      return res.sendStatus(404);
    }
    if(likeDislike==="like") { 
      await connection.query('INSERT INTO "postLiked" ("userId","postId") VALUES ($1,$2)',[userId,postId]);
      return res.send("Like").status(200);
    } else { 
      await connection.query('DELETE FROM "postLiked" WHERE "userId"= $1 AND "postId"= $2',[userId,postId]);
      return res.send("Dislike").status(204);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

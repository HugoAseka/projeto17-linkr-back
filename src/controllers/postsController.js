import { postSchema } from "../schemas/postsSchema.js";
import { postRepository } from "../repositories/postsRepository.js";
import { hashtagRepository } from "../repositories/hashtagRepository.js";



export async function getAllPosts(req, res) {
  const { rows: posts } = await postRepository.selectPosts();
  return res.status(200).send(posts);
}

export async function insertPost(req, res) {
  const Authorization = req.headers.authorization;
  const token = Authorization?.replace("Bearer ", "");
  const newPost = req.body;
  const { error } = postSchema.validate(newPost);
  const { description } = newPost;

  const arr = description.split(" ");
  const hashtags = arr.filter((str) => str[0] === "#");

  if (error) {
    return res.sendStatus(400);
  }

  
    const {postId,userId} = await postRepository.createPost(token, newPost);
    hashtags.map(async (hashtag) => {
      await hashtagRepository.newHashtag(hashtag);
    });
   
    hashtags.map(async (hashtag) => {
      await hashtagRepository.hashtagsPosts(hashtag, postId,userId);
    });

    
    res.sendStatus(200);
 
}

export async function updateLike(req, res) {
  const postId = req.params.id;
  const likeDislike = req.body.postLiked;
  const userId = res.locals.userId;

  try {
    const { rows: postExist } = await postRepository.existPost(postId);
    if (postExist.length === 0) {
      return res.sendStatus(404);
    }
    if (likeDislike === "like") {
      await postRepository.likePost(userId, postId);
      return res.send("Like").status(200);
    } else {
      await postRepository.dislikePost(userId, postId);
      return res.send("Dislike").status(204);
    }
  } catch (error) {

    return res.sendStatus(500);
  }
}

export async function deletePost(request, response) {
  const postId = request.params.id;
  const userId = response.locals.userId;

  const { rows: post } = await postRepository.existPost(postId);
  console.log(post);
  if(post.length === 0) {
    return response.status(404).send("Post não encontrado");
  }
  await hashtagRepository.deletingHashtagPost(userId, postId);

  await postRepository.deletingPost(userId, postId);

  response.sendStatus(200);
}

export async function editPost(request, response) {
  const postId = request.params.id;
  const userId = response.locals.userId;



}
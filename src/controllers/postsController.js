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
  const newHashtags = hashtags.map(string => string.replace("#", ""));

  if (error) {
    return res.sendStatus(400);
  }

  
    const {postId,userId} = await postRepository.createPost(token, newPost);
    newHashtags.map(async (hashtag) => {
      await hashtagRepository.newHashtag(hashtag);
    });
   
    newHashtags.map(async (hashtag) => {
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
  try {
    const postId = request.params.id;
    const userId = response.locals.userId;
    const { rows: post } = await postRepository.existPost(postId);
    
    if(post.length === 0) {
      return response.status(404).send("Post não encontrado!");
    }
    if(post[0].userId !== userId) {
      return response.status(401).send("Usuário não pode deletar esse post!");
    }
    await hashtagRepository.deletingHashtagPost(userId, postId);

    await postRepository.deletingPost(userId, postId);

    return response.sendStatus(200);
  } catch {
    return response.status(500).send("Erro no servidor");
  }
  
}

export async function editPost(request, response) {

  const description = request.body.description
  const postId = request.params.id;
  const userId = response.locals.userId;

  const { rows: post } = await postRepository.existPost(postId);

  if(post.length === 0) {
    return response.status(404).send("Post não encontrado")
  }

  if(post[0].userId !== userId) {
    return response.status(401).send("Usuário não pode editar esse post!");
  }

  await postRepository.updatePost(userId, postId, description);
  await hashtagRepository.deletingHashtagPost(userId, postId);

  const arr = description.split(" ");
  const hashtags = arr.filter((str) => str[0] === "#");
  const newHashtags = hashtags.map(string => string.replace("#", ""));

    newHashtags.map(async (hashtag) => {
      await hashtagRepository.newHashtag(hashtag);
    });
   
    newHashtags.map(async (hashtag) => {
      await hashtagRepository.hashtagsPosts(hashtag, postId,userId);
    });

  response.status(200).send("ok");
}
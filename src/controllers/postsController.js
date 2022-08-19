import { postSchema } from "../schemas/postsSchema.js";
import { postRepository } from "../repositories/postsRepository.js";
import { hashtagRepository } from "../repositories/hashtagRepository.js";
import connection from "../db/database.js";

export async function getAllPosts(req, res) {
  const limit = parseInt(req.query.queryLimit);
  const userId = parseInt(req.query.userId);


  try {
    const posts = await postRepository.selectPosts(limit, userId);
    return res.status(200).send(posts);
  } catch(error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function insertPost(req, res) {
  const Authorization = req.headers.authorization;
  const token = Authorization?.replace("Bearer ", "");
  const newPost = req.body;
  const { error } = postSchema.validate(newPost);
  const { description } = newPost;

  const arr = description.split(" ");
  const hashtags = arr.filter((str) => str[0] === "#");
  const newHashtags = hashtags.map((string) => string.replace("#", ""));

  if (error) {
    return res.sendStatus(400);
  }

  const { postId, userId } = await postRepository.createPost(token, newPost);
  await postRepository.likePost(userId, postId);
  newHashtags.map(async (hashtag) => {
    await hashtagRepository.newHashtag(hashtag);
  });
  newHashtags.map(async (hashtag) => {
    await hashtagRepository.hashtagsPosts(hashtag, postId, userId);
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
    const { rows: isLikedDisliked } = await postRepository.existLike(
      postId,
      userId
    );
    if (likeDislike === "like") {
      if (isLikedDisliked.length !== 0) {
        return res.status(401).send("Você já curtiu esse post!");
      }
      await postRepository.updateLikes(postId, userId, postExist[0].likes);
      await postRepository.likePost(userId, postId);
      return res.send("Like").status(200);
    } else if (likeDislike === "dislike") {
      if (isLikedDisliked.length === 0) {
        return res.status(401).send("Você já descurtiu esse post!");
      }
      await postRepository.updateDeslikes(postId, postExist[0].likes);

      await postRepository.dislikePost(userId, postId);
      return res.send("Dislike").status(204);
    }
    return res.sendStatus(500);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function deletePost(request, response) {
  try {
    const postId = request.params.id;
    const userId = response.locals.userId;
    const { rows: post } = await postRepository.existPost(postId);

    if (post.length === 0) {
      return response.status(404).send("Post não encontrado!");
    }
    if (post[0].userId !== userId) {
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
  const description = request.body.description;
  const postId = request.params.id;
  const userId = response.locals.userId;

  const { rows: post } = await postRepository.existPost(postId);

  if (post.length === 0) {
    return response.status(404).send("Post não encontrado");
  }

  if (post[0].userId !== userId) {
    return response.status(401).send("Usuário não pode editar esse post!");
  }

  await postRepository.updatePost(userId, postId, description);
  await hashtagRepository.deletingHashtagPost(userId, postId);

  const arr = description.split(" ");
  const hashtags = arr.filter((str) => str[0] === "#");
  const newHashtags = hashtags.map((string) => string.replace("#", ""));

  newHashtags.map(async (hashtag) => {
    await hashtagRepository.newHashtag(hashtag);
  });

  newHashtags.map(async (hashtag) => {
    await hashtagRepository.hashtagsPosts(hashtag, postId, userId);
  });

  response.status(200).send("ok");
}

export async function repost(req, res) {
  const userId = res.locals.userId;
  const { postId } = req.params;

  try {
    const { rows: postExistence } = await postRepository.existPost(postId);
    if (postExistence.length === 0) {
      return res.sendStatus(404);
    }
    const { rows: verifyOwner } = await postRepository.verifyOwnerPost(
      postId,
      userId
    );
    if (verifyOwner.length !== 0) {
      return res.status(401).send("This is your post, you can't repost it!");
    }
    const { rows: repostSamePost } = await postRepository.sameRepost(
      userId,
      postId
    );
    if (repostSamePost.length !== 0) {
      return res.status(401).send("You already reposted it!");
    }
    await postRepository.repost(userId, postId);
    await postRepository.updatePostsRepost(++postExistence[0].reposts, postId);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

} 

export async function comments(req,res) { 
  const userId = res.locals.userId;
  const { postId } = req.params; 
  const { comment } = req.body;

  try {
    const { rows: postExistence } = await postRepository.existPost(postId);
    if(postExistence.length === 0) { 
      return res.sendStatus(404);
    }
    if(comment.length < 255) {
      await postRepository.postCommentaries(comment,userId,postId);
      await postRepository.updatePostComments(++postExistence[0].comments,postId);
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getComments(req,res) { 
  const { id } = req.params;

  try {
    const { rows: postExistence } = await postRepository.existPost(id);
    if (postExistence.length === 0) {
      return res.sendStatus(404);
    }
    const { rows: postComments } = await postRepository.getComments(id);
      return res.send(postComments.map((u) => u.json_build_object)).status(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

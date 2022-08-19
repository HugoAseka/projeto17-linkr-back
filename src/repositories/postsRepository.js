import connection from "../db/database.js";
import urlMetadata from "url-metadata";

async function createPost(token, newPost) {
  const { url, description } = newPost;
  const { rows } = await connection.query(
    `SELECT u.id FROM users u JOIN sessions s ON u.id = s."userId" WHERE s.token = $1 `,
    [token]
  );

  const user = rows[0];

  return urlMetadata(url).then(async (m) => {
    const { rows: postIdObj } = await connection.query(
      `INSERT INTO posts (url,description,"userId","urlDescription","urlImage","urlTitle") VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;`,
      [url, description, user.id, m.description, m.image, m.title]
    );
    const userId = user.id;
    const postId = postIdObj[0].id;

    return { userId, postId };
  });
}

async function selectPosts(limit, userId) {
  const { rows: followers } = await connection.query(
    `SELECT "mainUserId" FROM followers WHERE "followerId" = $1 `,
    [userId]
  );

  const { rows: postsJsonObj } = await connection.query(
    `SELECT json_build_object(
      'id', p.id,
      'url', p.url,
      'description', p.description, 
      'urlDescription', p."urlDescription",
      'urlImage', p."urlImage", 
      'urlTitle',  p."urlTitle", 
      'likes', p.likes, 
      'userId', u.id,
      'username', u.username, 
      'email', u.email, 
      'profilePhoto', u."profilePhoto", 
      'reposts', p.reposts, 
      'comments', p.comments,
      'usersLiked', json_agg(json_build_object(
        'userId', "postLiked"."userId"
      )))

    FROM posts p 
    JOIN users u 
    ON p."userId" = u.id
    JOIN "postLiked"
    ON p.id = "postLiked"."postId"
    GROUP BY p.id, u.id
    ORDER BY p."createdAt" DESC  
    `
  );

  const allPosts = postsJsonObj.map((obj) => obj.json_build_object);
  const posts = allPosts.filter((post) => {
    if (followers.length !== 0) {
      for (let i = 0; i < followers.length; i++) {
        if (post.userId === followers[i].mainUserId || post.userId === userId)
          return true;
      }
    } else {
      if (post.userId === userId) return true;
    }
    return false;
  });

  

  return posts.filter((post,index) => index < limit );
}

async function dislikePost(userId, postId) {
  return connection.query(
    'DELETE FROM "postLiked" WHERE "userId"= $1 AND "postId"= $2',
    [userId, postId]
  );
}

async function likePost(userId, postId) {
  return await connection.query(
    'INSERT INTO "postLiked" ("userId","postId") VALUES ($1,$2)',
    [userId, postId]
  );
}

async function existPost(postId) {
  return await connection.query("SELECT * FROM posts WHERE id= $1", [postId]);
}

async function deletingPost(userId, postId) {
  return await connection.query(
    `
  DELETE FROM posts
  WHERE posts.id = ($1) AND posts."userId" = ($2)
  `,
    [postId, userId]
  );
}

async function updatePost(userId, postId, description) {
  return await connection.query(
    `
  UPDATE posts SET description = ($1) 
  WHERE posts.id = ($2) AND posts."userId" = ($3)
  `,
    [description, postId, userId]
  );
}

async function updateLikes(postId, likes) {
  return await connection.query("UPDATE posts SET likes= $1 WHERE id= $2", [
    ++likes,
    postId,
  ]);
}

async function existLike(postId, userId) {
  return await connection.query(
    `
  SELECT * FROM "postLiked" 
  WHERE "postId" = ($1) AND "userId" = ($2)
  `,
    [postId, userId]
  );
}

async function updateDeslikes(postId, likes) {
  console.log(likes);
  return await connection.query("UPDATE posts SET likes= $1 WHERE id= $2", [
    --likes,
    postId,
  ]);
}

async function verifyOwnerPost(postId, userId) {
  return await connection.query(
    `
    SELECT u.id AS "ownerId", p.* 
    FROM posts p
    JOIN users u ON p."userId" = u.id
    WHERE p.id= $1 AND u.id= $2
    `,
    [postId, userId]
  );
}

async function sameRepost(userId, postId) {
  return await connection.query(
    `SELECT * FROM "rePosts" WHERE "userId"= $1 AND "postId"= $2`,
    [userId, postId]
  );
}

async function repost(userId, postId) {
  return await connection.query(
    `INSERT INTO "rePosts" ("userId","postId") VALUES ($1,$2)`,
    [userId, postId]
  );
}

async function updatePostsRepost(reposts,postId) { 
  return await connection.query(`UPDATE posts SET reposts= $1 WHERE id= $2`,[reposts,postId]);
} 

async function postCommentaries(comment,userId,postId) { 
  return await connection.query(`INSERT INTO comentaries (coment,"userId","postId") VALUES ($1,$2,$3)`,[comment,userId,postId]);
} 

async function updatePostComments(comments,postId) { 
  return await connection.query(`UPDATE posts SET comments= $1 WHERE id= $2`,[comments,postId]); 
} 

async function getComments(id) { 
  return await connection.query(`SELECT json_build_object(
    'postId', c."postId",  
    'allComments', json_agg(json_build_object( 
      'coment', c.coment, 
      'userId', c."userId",
      'username', u.username, 
      'profilePhoto', u."profilePhoto"
      )))
      FROM comentaries c 
      JOIN users u ON u.id = c."userId"
      WHERE c."postId" = $1
      GROUP BY c."postId"
    `,[id]); 
}

export const postRepository = {
  createPost,
  selectPosts,
  likePost,
  dislikePost,
  existPost,
  deletingPost,
  updatePost,
  updateLikes,
  updateDeslikes,
  existLike, 
  verifyOwnerPost, 
  sameRepost, 
  repost, 
  updatePostsRepost, 
  postCommentaries, 
  updatePostComments, 
  getComments

};

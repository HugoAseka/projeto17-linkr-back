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
    const {rows: postIdObj} = await connection.query(
      `INSERT INTO posts (url,description,"userId","urlDescription","urlImage","urlTitle") VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;` ,
      [url, description, user.id, m.description, m.image, m.title]
    );
    const userId = user.id;
    const postId = postIdObj[0].id;
    return {userId, postId};
  });
 
}

async function selectPosts() {
  return connection.query(
    `SELECT p.id, p.url, p.description, u.username, u.email, u."profilePhoto", p."urlDescription", p."urlImage", p."urlTitle"  FROM posts p 
    JOIN users u ON p."userId" = u.id 
    ORDER BY p."createdAt" DESC  
    LIMIT 20; `
  );
}

async function dislikePost(userId,postId) { 
  return connection.query('DELETE FROM "postLiked" WHERE "userId"= $1 AND "postId"= $2',[userId,postId]);
}

async function likePost(userId,postId) { 
  return await connection.query('INSERT INTO "postLiked" ("userId","postId") VALUES ($1,$2)',[userId,postId]);
}

async function existPost(postId) { 
  return await connection.query('SELECT * FROM posts WHERE id= $1',[postId]);
}

async function deletingPost(userId, postId) { 
  
  return await connection.query(`
  DELETE FROM posts
  WHERE posts.id = ($1) AND posts."userId" = ($2)
  `, [postId, userId]);
}

async function updatePost(userId, postId, description) {

  return await connection.query(`
  UPDATE posts SET description = ($1) 
  WHERE posts.id = ($2) AND posts."userId" = ($3)
  `, [description ,postId , userId]);
}

export const postRepository = {
  createPost,
  selectPosts,
  likePost, 
  dislikePost, 
  existPost,
  deletingPost,
  updatePost
};

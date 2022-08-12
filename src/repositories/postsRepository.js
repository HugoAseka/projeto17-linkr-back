import connection from "../db/database.js";
import urlMetadata from "url-metadata";

async function createPost(token, newPost) {
  const { url, description } = newPost;
  const { rows } = await connection.query(
    `SELECT u.id FROM users u JOIN sessions s ON u.id = s."userId" WHERE s.token = $1 `,
    [token]
  );
  const user = rows[0];
  urlMetadata(url).then((m) => {
    connection.query(
      `INSERT INTO posts (url,description,"userId","urlDescription","urlImage","urlTitle") VALUES ($1,$2,$3,$4,$5,$6)`,
      [url, description, user.id, m.description, m.image, m.title]
    );
  });
}

async function selectPosts() {
  return connection.query(
    `SELECT p.url, p.description, u.username, u.email, u."profilePhoto", p."urlDescription", p."urlImage", p."urlTitle"  FROM posts p 
    JOIN users u ON p."userId" = u.id 
    ORDER BY p."createdAt" DESC  
    LIMIT 20; `
  );
}

export const postRepository = {
  createPost,
  selectPosts,
};

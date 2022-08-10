import connection from "../db/database.js";

async function createPost(token, newPost) {
  const { url, description } = newPost;
  const { rows } = await connection.query(
    `SELECT u.id FROM users u JOIN sessions s ON u.id = s."userId" WHERE s.token = $1 `,
    [token]
  );

  const user = rows[0];

  await connection.query(
    `INSERT INTO posts (url,description,"userId") VALUES ($1,$2,$3)`,
    [url, description, user.id]
  );
}

async function selectPosts() {
  return connection.query(
    `SELECT p.url, p.description, u.username, u.email, u."profilePhoto" FROM posts p JOIN users u ON p."userId" = u.id ORDER BY p."createdAt" DESC  LIMIT 20; `
  );
}

export const postRepository = {
  createPost,
  selectPosts,
};

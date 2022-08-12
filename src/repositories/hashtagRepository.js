import connection from "../db/database.js";

async function getPostsByHashtags(hashtag) {
  return await connection.query(
    `
    SELECT posts.* 
    FROM hashtags
    JOIN "hashtagsPosts" 
    ON hashtags.id = "hashtagsPosts"."hashtagId"
    JOIN posts
    ON "hashtagsPosts"."postId" = posts.id
    WHERE hashtags.name = ($1)
    ORDER BY "createdAt" DESC
        `,
    [hashtag]
  );
}

async function newHashtag(hashtag) {
  const { rows: existingHashtagArray } = await connection.query(
    `SELECT * FROM hashtags WHERE name = $1`,
    [hashtag]
  );
  if (existingHashtagArray.length === 0) {
    await connection.query(`INSERT INTO hashtags (name) VALUES ($1)`, [
      hashtag,
    ]);
  }
}

async function hashtagsPosts(hashtag, userId, postId) {
  const { rows: hashtagIdArray } = await connection.query(
    `SELECT * FROM hashtags WHERE name = $1`,
    [hashtag]
  );
  
  const hashtagId = hashtagIdArray[0].id;

  await connection.query(
    `INSERT INTO "hashtagsPosts" ("postId","hashtagId","userId") VALUES ($1,$2,$3)`,
    [userId, hashtagId,postId ]
  );
}

export const hashtagRepository = {
  getPostsByHashtags,
  newHashtag,
  hashtagsPosts,
};

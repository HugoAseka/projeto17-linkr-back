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
    [userId, hashtagId, postId]
  );
}

async function getHashtagRank() {
  return connection.query(`
    SELECT hashtags.id, hashtags.name, Count("hashtagsPosts"."hashtagId") AS count
    FROM hashtags
    JOIN "hashtagsPosts"
    ON hashtags.id = "hashtagsPosts"."hashtagId"
    GROUP BY hashtags.id
    ORDER BY count DESC
    LIMIT 10
    `);
}

async function deletingHashtagPost(userId, postId) {

  return connection.query(`
  DELETE FROM "hashtagsPosts"
  WHERE "hashtagsPosts"."postId" = ($1) AND "hashtagsPosts"."userId" = ($2) 
  `, [postId, userId]);
}


export const hashtagRepository = {
  getPostsByHashtags,
  getHashtagRank,
  hashtagsPosts,
  newHashtag,
  deletingHashtagPost
};

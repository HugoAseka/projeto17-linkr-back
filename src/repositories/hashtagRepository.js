import connection from "../db/database.js";

async function getPostsByHashtags(hashtag) {
  console.log("teste")
  const {rows : hashtagPosts} = await connection.query(
    `
    SELECT json_build_object(
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
      'usersLiked', json_agg(json_build_object(
        'userId', "postLiked"."userId"
      )))
    FROM hashtags
    JOIN "hashtagsPosts" 
    ON hashtags.id = "hashtagsPosts"."hashtagId"
    JOIN posts p
    ON "hashtagsPosts"."postId" = p.id
    JOIN users u
    ON p."userId" = u.id
    JOIN "postLiked"
    ON p.id = "postLiked"."postId"
    WHERE hashtags.name = ($1)
    GROUP BY p.id, u.id
    ORDER BY p."createdAt" DESC`,
    [hashtag]
  );
  
  return hashtagPosts.map(object => object.json_build_object);
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

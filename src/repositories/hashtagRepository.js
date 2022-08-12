import connection from '../db/database.js';

async function getPostsByHashtags (hashtag) { 
    return await connection.query(`
    SELECT posts.* 
    FROM hashtags
    JOIN "hashtagsPosts" 
    ON hashtags.id = "hashtagsPosts"."hashtagId"
    JOIN posts
    ON "hashtagsPosts"."postId" = posts.id
    WHERE hashtags.name = ($1)
    ORDER BY "createdAt" DESC
        `,[hashtag]);
} 

async function getHashtagRank () {
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

export const hashtagRepository = { 
    getPostsByHashtags,
    getHashtagRank
}
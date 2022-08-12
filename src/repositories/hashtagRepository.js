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

export const hashtagRepository = { 
    getPostsByHashtags
}
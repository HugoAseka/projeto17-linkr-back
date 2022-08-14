import connection from '../db/database.js';

async function getUserClicked(id) { 
    return await connection.query(`SELECT json_build_object(
        'id', u.id, 
        'username', u.username, 
        'profilePhoto', u."profilePhoto", 
        'posts', json_agg(json_build_object(
            'id', p.id, 
            'url', p.url, 
            'description', p.description,
            'urlDescription', p."urlDescription", 
            'urlTitle', p."urlTitle", 
            'urlImage', p."urlImage", 
            'likes', COUNT(pl."userId")
        )))
        FROM users u
        JOIN posts p ON p."userId" = u.id
        JOIN "postLiked" pl ON pl."postId" = p.id
        WHERE u.id= $1
        GROUP BY u.id, pl."postId"
        `,[id]);
} 

async function getUsersbyName(username) { 
    return await connection.query({
        text: `SELECT id,username,"profilePhoto"
        FROM users
        WHERE username 
        ILIKE ($1)
        OFFSET 0 LIMIT 10
    `,values: [`${username}%`]}); 
}

export const otherUsersRepository = { 
    getUserClicked, getUsersbyName
}
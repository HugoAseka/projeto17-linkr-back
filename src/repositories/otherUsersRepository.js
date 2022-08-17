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
            'likes', p.likes
        )))
        FROM users u
        JOIN posts p ON p."userId" = u.id
        WHERE u.id= $1
        GROUP BY u.id
        `,[id]);
} 

async function getUsersbyName(username, userId) { 
    return await connection.query({
        text: `SELECT u.id,u.username,u."profilePhoto", f."followerId"
        FROM users u
        LEFT JOIN followers f
        ON f."mainUserId" = u.id
        WHERE u.username ILIKE ($1) AND f."followerId" = $2 OR f."followerId" IS NULL AND u.username ILIKE ($1)
        GROUP BY u.id, f."followerId"
        ORDER BY f."followerId" ASC
        OFFSET 0 LIMIT 10
        
    `,values: [`${username}%`, userId]}); 
}

export const otherUsersRepository = { 
    getUserClicked, getUsersbyName
}
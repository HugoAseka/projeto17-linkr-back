import connection from "../db/database.js";

async function getUserClicked(id) {
  return await connection.query(
    `SELECT json_build_object(
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
            'likes', p.likes, 
            'reposts', p.reposts
        )))
        FROM users u
        JOIN posts p ON p."userId" = u.id
        WHERE u.id= $1
        GROUP BY u.id
        `,
    [id]
  );
}

async function getUserWithoutPosts(id) {
  return await connection.query(`SELECT * FROM users WHERE id= $1`, [id]);
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
    `,
    values: [`${username}%`, userId],
  });
}

async function getReposted(id) {
  return await connection.query(
    `SELECT json_build_object( 
        'reposts', json_agg(json_build_object(
            'id', p.id, 
            'url', p.url, 
            'description', p.description,
            'urlDescription', p."urlDescription", 
            'urlTitle', p."urlTitle", 
            'urlImage', p."urlImage", 
            'likes', p.likes, 
            'reposts', p.reposts, 
            'ownerUsername', uu.username,
            'ownerProfilePhoto', uu."profilePhoto", 
            'ownerId', uu.id,
            'repostedUsername', u.username, 
            'repostedUserId', u.id
        )))
        FROM posts p 
        JOIN "rePosts" rp ON rp."postId"=p.id
        JOIN users u ON u.id = rp."userId"
        JOIN users uu ON p."userId" = uu.id
        WHERE u.id= $1
    `,
    [id]
  );
}
async function hasFollowed(userId) {
  const { rows: followers } = await connection.query(
    `SELECT "followerId" FROM followers WHERE "mainUserId" = $1 `,
    [userId]
  );

  return followers;
}

export const otherUsersRepository = {
  getUserClicked,
  getUsersbyName,
  getUserWithoutPosts,
  getReposted,
  hasFollowed,
};

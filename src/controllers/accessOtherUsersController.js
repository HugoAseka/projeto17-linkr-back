import connection from '../db/database.js';

export async function getClickedUser(req,res) { 
    const { id } = req.params; 

    try {
        const { rows: user } = await connection.query(`SELECT json_build_object(
            'id', u.id, 
            'username', u.username, 
            'profilePhoto', u."profilePhoto", 
            'posts', json_agg(json_build_object(
                'id', p.id, 
                'url', p.url, 
                'description', p.description
            )))
            FROM users u
            JOIN posts p ON p."userId" = u.id
            WHERE u.id= $1
            GROUP BY u.id
            `,[id]);
        if(user.length===0) { 
            return res.sendStatus(404);
        }
        return res.send(user.map(u => u.json_build_object)).status(200);
    } catch (error) {
        console.log(error); 
        return res.sendStatus(500);
    }
} 

export async function getUserByName(req,res) { 
    const { username } = req.query; 

    try {
        if(username.length>=3) { 
            const { rows: findUsers } = await connection.query({
                text: `SELECT id,username,"profilePhoto"
                FROM users
                WHERE username 
                ILIKE ($1)
                OFFSET 0 LIMIT 10
            `,values: [`${username}%`]}); 

            if(findUsers.length===0) { 
                return res.sendStatus(404);
            }
            return res.send(findUsers).status(200);
        } else { 
            return res.sendStatus(400);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
import connection from '../db/database.js';

export async function getClickedUser(req,res) { 
    const { id } = req.params; 

    try {
        const { rows: user } = await connection.query(`
            SELECT * 
            FROM users
            WHERE id= $1
            `,[id]);
        if(user.length===0) { 
            return res.sendStatus(404);
        }
        return res.send(user).status(200);
    } catch (error) {
        console.log(user); 
        return res.sendStatus(500);
    }
} 
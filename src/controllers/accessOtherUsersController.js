import connection from '../db/database.js';
import { otherUsersRepository } from '../repositories/otherUsersRepository.js';
import { followSchema } from '../schemas/followSchema.js';

export async function getClickedUser(req,res) { 
    const { id } = req.params; 

    try {
        const { rows: user } = await otherUsersRepository.getUserClicked(id)
        if(user.length===0) { 
            const { rows: userZeroPost } = connection.query(`SELECT * FROM users WHERE id= $1`,[id]);
            console.log(userZeroPost);
            return res.sendStatus(404);
        }
        return res.send(user.map(u => u.json_build_object)).status(200);
    } catch (error) {
        console.log(error); 
        return res.sendStatus(500);
    }
} 

export async function getUserByName(req,res) { 
    const { username } = req.body; 

    try {
        if(username.length>=3) { 
            const { rows: findUsers } = await otherUsersRepository.getUsersbyName(username);
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

export async function checkFollow (req, res) {
    const friendId = req.body;
    const userId = res.locals.userId;
    const {error} = followSchema.validate(friendId);
    if (error) return res.status(422).send(error.message);
    try {
        const { rows: follower} = await connection.query(`
        SELECT * from followers
        WHERE "mainUserId" = $1 AND "followerId" = $2
        `, [friendId.friendId, userId]);
        if (follower.length === 0) return res.status(404).json({
            isFollower: false
        });
        return res.status(200).json({
            isFollower: true
        });
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function followFriend (req, res) {
    const friendId = req.body;
    const userId = res.locals.userId;
    const {error} = followSchema.validate(friendId);
    if (error) return res.status(422).send(error.message);
    try {
        await connection.query(`
        INSERT INTO followers
        ("mainUserId", "followerId")
        VALUES ($1, $2);
        `, [friendId.friendId, userId]);
        return res.status(200).send("Followed user" + " " + friendId.friendId);
    } catch (error) {
        return res.sendStatus(500);
    }
}
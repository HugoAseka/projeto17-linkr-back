import { otherUsersRepository } from '../repositories/otherUsersRepository.js';

export async function getClickedUser(req,res) { 
    const { id } = req.params; 

    try {
        const { rows: user } = await otherUsersRepository.getUserClicked(id)
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
    const { username } = req.body; 
    console.log(username);

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
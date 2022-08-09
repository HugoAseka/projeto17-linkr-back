import connection from '../db/database.js';
import bcrypt, { compareSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { signUpSchema } from '../schemas/authSchema.js';

export async function signUp (req, res) {
    const newUser = req.body;
    const { error } = signUpSchema.validate(newUser);
    if (error) return res.status(422).send(error.message);
    try {
        
        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
}
export async function login (req, res) {
    const userLogin = req.body;
}
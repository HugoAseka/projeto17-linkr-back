import connection from '../db/database.js';
import bcrypt, { compareSeync } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { signUpSchema } from '../schemas/authSchema.js';

export async function signUp (req, res) {
    const newUser = req.body;
    const { error } = signUpSchema.validate(newUser);
}
export async function login (req, res) {
    const userLogin = req.body;
}
import connection from '../db/database.js';
import bcrypt, { compareSeync } from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function signUp (req, res) {
    const user = req.body;
}
export async function login (req, res) {
    const userLogin = req.body;
}
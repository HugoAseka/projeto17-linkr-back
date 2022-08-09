import connection from '../db/database.js';
import bcrypt, { compareSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { signUpSchema, loginSchema } from '../schemas/authSchema.js';

export async function signUp (req, res) {
    const newUser = req.body;
    const { error } = signUpSchema.validate(newUser);
    if (error) return res.status(422).send(error.message);
    try {
            const checkExistingUser = await connection.query(`
            SELECT * FROM users
            WHERE email = $1;
            `, [newUser.email]);
            if (checkExistingUser.rowCount > 0) return res.status(409).send("Esse email está em uso");
    
            const passwordHash = bcrypt.hashSync(newUser.password, 10);
    
            await connection.query(`
            INSERT INTO users
            (username, email, password, "profilePhoto")
            VALUES ($1, $2, $3, $4);
            `, [newUser.username, newUser.email, passwordHash, newUser.profilePhoto]);
        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
}
export async function login (req, res) {
    const userLogin = req.body;
    const { error } = loginSchema.validate(userLogin);
    if (error) return res.status(422).send(error.message);
    try {
        const checkExistingUser = await connection.query(`
        SELECT * FROM users
        WHERE email = $1;
        `, [userLogin.email]);
        if (checkExistingUser.rowCount === 0) return res.sendStatus(401);
        const comparePassword = compareSync(userLogin.password, checkExistingUser.rows[0].password);
        if (!comparePassword) return res.sendStatus(401);
        const token = uuid();
        const addToken = await connection.query(`
        INSERT INTO sessions
        (token, "userId")
        VALUES ($1, $2);
        `, [token, checkExistingUser.rows[0].id]);
        return res.status(200).json({
            user: {
                id: checkExistingUser.rows[0].id,
                email: checkExistingUser.rows[0].email,
                profilePhoto: checkExistingUser.rows[0].profilePhoto,
                username: checkExistingUser.rows[0].username
            },
            token
        })
    } catch (error) {
        return res.sendStatus(500);
    }
}
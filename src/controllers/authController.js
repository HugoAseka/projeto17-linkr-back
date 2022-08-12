import connection from "../db/database.js";
import { compareSync } from "bcrypt";
import { signUpSchema, loginSchema } from "../schemas/authSchema.js";
import { authRepository } from "../repositories/authRepository.js";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
  const newUser = req.body;
  const { error } = signUpSchema.validate(newUser);
  if (error) return res.status(422).send(error.message);
  try {
    const { rows: user } = await authRepository.checkExistingUser(newUser);
    if (user.length > 0)
      return res.status(409).send("Esse username está em uso");
    const { rows: userEmail } = await authRepository.checkExistingEmail(
      newUser
    );
    if (userEmail.length > 0)
      return res.status(409).send("Esse email está em uso");
    await authRepository.addUser(newUser);
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}
export async function login(req, res) {
  const userLogin = req.body;
  const { error } = loginSchema.validate(userLogin);
  if (error) return res.status(422).send(error.message);
  try {
    const { rows: user } = await authRepository.checkExistingEmail(userLogin);
    if (user.length === 0) return res.sendStatus(401);
    const comparePassword = compareSync(userLogin.password, user[0].password);
    if (!comparePassword) return res.sendStatus(401);
    const token = uuid();
    const addToken = await authRepository.addToken(userLogin, token);
    return res.status(200).json({
      user: {
        id: user[0].id,
        email: user[0].email,
        profilePhoto: user[0].profilePhoto,
        username: user[0].username,
      },
      token
    });
  } catch (error) {
    return res.sendStatus(500);
  }
}
export async function logout(req, res) {
  const token = res.locals.token;
  const userId = res.locals.userId;
  try {
    await connection.query(
      `
        DELETE FROM sessions
        WHERE token = $1 AND "userId" = $2;
        `,
      [token, userId]
    );
    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
}

import connection from "../db/database.js";
import bcrypt from "bcrypt";


async function checkExistingUser(user) {
  const { username } = user;
  return await connection.query(
    `
    SELECT * FROM users
    WHERE username = $1;
    `,
    [username]
  );
}

async function checkExistingEmail(user) {
  const { email } = user;
  return await connection.query(
    `
    SELECT * FROM users
    WHERE email = $1;
    `,
    [email]
  );
}

async function addUser(user) {
  const { password, username, email, profilePhoto } = user;
  const passwordHash = bcrypt.hashSync(password, 10);
  return await connection.query(
    `
    INSERT INTO users
    (username, email, password, "profilePhoto")
    VALUES ($1, $2, $3, $4);
    `,
    [username, email, passwordHash, profilePhoto]
  );
}

async function addToken(user, token) {
  const { email } = user;
  const { rows: userSelected } = await connection.query(
    `
    SELECT * FROM users
    WHERE email = $1;
    `,
    [email]
  );

  return await connection.query(
    `
        INSERT INTO sessions
        (token, "userId")
        VALUES ($1, $2);
        `,
    [token, userSelected[0].id]
  );
}

export const authRepository = {
  checkExistingUser,
  checkExistingEmail,
  addUser,
  addToken,
};

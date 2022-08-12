import connection from "../db/database.js";

export async function checkAuth (req, res, next) {
    const Authorization = req.headers.authorization;
    const token = Authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);
    try {
        const checkUserSession = await connection.query(`
        SELECT * FROM sessions
        WHERE token = $1;
        `, [token]);
        if (checkUserSession.rowCount === 0) return res.sendStatus(401);
        const userSession = checkUserSession.rows[0];
        if (!userSession) return res.sendStatus(401);
        res.locals.token = token;
        res.locals.userId = checkUserSession.rows[0].userId;
    } catch (error) {
        return res.sendStatus(500);
    }
    next();
}
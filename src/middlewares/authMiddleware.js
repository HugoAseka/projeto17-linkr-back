import { authRepository } from "../repositories/authRepository.js";

export async function checkAuth (req, res, next) {
    const Authorization = req.headers.authorization;
    const token = Authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);
    try {
        const { rows: existingToken} = await authRepository.checkToken(token);
        if (existingToken.length === 0) return res.sendStatus(401);
        const userSession = existingToken[0];
        if (!userSession) return res.sendStatus(401);
        res.locals.token = token;
        res.locals.userId = existingToken[0].userId;
    } catch (error) {
        return res.sendStatus(500);
    }
    next();
}
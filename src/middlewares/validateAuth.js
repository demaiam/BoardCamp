import { db } from "../database/database.connection.js";

export async function validateAuth(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    try {
        const session = await db.collection("session").findOne({ token });
        if (!session) return res.sendStatus(401);

        const user = await db.collection("users").findOne({ _id: session.idUser });
        if (!user) return res.sendStatus(401);
        
        delete user.password;
    
        res.locals.user = user;

        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
}
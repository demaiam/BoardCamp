import { Router } from "express";
import { getGames, postGame } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { schemaGame } from "../schemas/game.schemas.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(schemaGame), postGame);

export default gamesRouter;
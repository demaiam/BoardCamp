import { Router } from "express";
import { getRentals, postRental, checkoutRental, deleteRental } from "../controllers/rentals.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaRental } from "../schemas/rental.schemas.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(schemaRental), postRental);
rentalsRouter.put("/rentals/:id", checkoutRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
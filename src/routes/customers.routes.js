import { Router } from "express";
import { getCustomers, getCustomerById, postCustomer, updateCustomer } from "../controllers/customers.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { schemaCustomer } from "../schemas/customer.schemas.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers)
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateSchema(schemaCustomer), postCustomer);
customersRouter.put("/customers/:id", updateCustomer);

export default customersRouter;
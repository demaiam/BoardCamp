import Joi from "joi";

export const schemaRental = Joi.object({
  customerId: Joi.any(),
  gameId: Joi.any(),
  daysRented: Joi.number().positive()
})
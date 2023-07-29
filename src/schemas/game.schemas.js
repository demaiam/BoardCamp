import Joi from "joi";

export const schemaGame = Joi.object({
  name: Joi.string().required(),
  image: Joi.any().optional(),
  stockTotal: Joi.number().positive().required(),
  pricePerDay: Joi.number().positive().required()
});
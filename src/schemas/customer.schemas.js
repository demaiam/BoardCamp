import Joi from "joi";

export const schemaCustomer = Joi.object({
  name: Joi.string().min(1).required(),
  phone: Joi.string().regex(/^[0-9]$/).min(10).max(11).required(),
  cpf: Joi.string().regex(/^[0-9]$/).length(11).required(),
  birthday: Joi.date().required()
});
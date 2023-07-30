import Joi from "joi";

export const schemaCustomer = Joi.object({
  name: Joi.string().min(1).required(),
  phone: Joi.string().numeric().min(10).max(11).required(),
  cpf: Joi.string().numeric().length(11).required(),
  birthday: Joi.date().required()
});
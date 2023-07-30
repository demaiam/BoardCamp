import Joi from "joi";

export const schemaCustomer = Joi.object({
  name: Joi.string().min(1).required(),
  phone: Joi.string().regex(/^[0-9]{10,11}$/).required(),
  cpf: Joi.string().regex(/^[0-9]{11}$/).required(),
  birthday: Joi.date().required()
});
import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

export const schemaCustomer = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().regex(/^[0-9]{10,11}$/).required(),
  cpf: Joi.string().regex(/^[0-9]{11}$/).required(),
  birthday: Joi.date().format('YYYY-MM-DD').required()
});
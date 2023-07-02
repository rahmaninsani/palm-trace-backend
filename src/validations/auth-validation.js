import Joi from 'joi';

const registerUserValidation = Joi.object({
  role: Joi.string().valid('dinas', 'petani', 'koperasi', 'pabrikKelapaSawit').required(),
  nama: Joi.string().max(200).required(),
  alamat: Joi.string().required(),
  nomorTelepon: Joi.string().required(),
  email: Joi.string().email().max(200).required(),
  password: Joi.string().max(200).required(),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().max(200).required(),
  password: Joi.string().max(200).required(),
});

export { registerUserValidation, loginUserValidation };

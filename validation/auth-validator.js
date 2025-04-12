const Joi = require("joi");
const loginValidationSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9.]+$/)
    .trim()
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .required(),
});

const signupValidationSchema = Joi.object({
  firstname: Joi.string().min(3).max(30).trim().required(),
  lastname: Joi.string().min(3).max(30).trim().required(),
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9.]+$/)
    .trim()
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .trim()
    .required(),
  gender: Joi.string().valid("male", "female", "not-set").trim().default("not-set"),
});

module.exports = {
  loginValidationSchema,
  signupValidationSchema,
};

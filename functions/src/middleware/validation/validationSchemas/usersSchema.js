const joi = require("joi");

const userRegister = joi.object({
  name: joi.string().required(),
  password: joi.string().min(8).required(),
  email: joi.string().email().required(),
});

const userLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const userChangePassword = joi.object({
  oldPassword: joi.string().min(8).required(),
  newPassword: joi.string().min(8).required(),
});

module.exports = {
  userRegister,
  userLogin,
  userChangePassword,
};

const joi = require('joi');

const wineSchema = joi.object({
  title: joi.string().required(),
  year: joi.number().required(),
  region: joi.string().required(),
});

module.exports = wineSchema;

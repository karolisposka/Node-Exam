const joi = require("joi");

const addWineToCollectionSchema = joi.object({
  id: joi.number().required(),
  quantity: joi.number().min(-200).max(500).required(),
});

module.exports = addWineToCollectionSchema;

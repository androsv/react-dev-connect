const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = isEmpty(data.text) ? "" : data.text;

  if (!validator.isLength(data.text, { min: 8, max: 256 })) {
    errors.text = "post must be between 8 and 256 characters";
  }
  if (validator.isEmpty(data.text)) {
    errors.text = "Text field is required ";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

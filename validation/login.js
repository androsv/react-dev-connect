const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;

  if (!validator.isEmail(data.email)) {
    errors.email = "Email not in correct format";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email is required ";
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "password should be btween 6 to 30 characters";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

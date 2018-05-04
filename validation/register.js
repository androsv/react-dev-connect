const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = isEmpty(data.name) ? "" : data.name;
  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;
  data.password2 = isEmpty(data.password2) ? "" : data.password2;

  if (!validator.isLength(data.name, { min: 2, max: 50 })) {
    errors.name = "Name length should be btween 2 and 50";
  }

  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email is required ";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Email not in correct format";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "password should be btween 6 to 30 characters";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password = "Confirm password is required";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password = "confirm password does not match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const config = require("config");
const joiRegisterValidation = require("./joi/registerValidation");
const joiLoginValidation = require("./joi/loginValidation");
const joiIdValidation = require("./joi/idValidation");

const validatorOption = config.get("validatorOption");

const registerUserValidation = (userInput) => {
  if (validatorOption === "Joi") {
    return joiRegisterValidation.validateRegisterSchema(userInput);
  }
  throw new Error("validator undefined");
};
const loginUserValidation = (userInput) => {
  if (validatorOption === "Joi") {
    return joiLoginValidation.validateLoginSchema(userInput);
  }
  throw new Error("validator undefined");
};

const userIdValidation = (idInput) => {
  if (validatorOption === "Joi") {
    return joiIdValidation.validateIdSchema(idInput);
  }
  throw new Error("validator undefined");
};

module.exports = {
  registerUserValidation,
  loginUserValidation,
  userIdValidation
};

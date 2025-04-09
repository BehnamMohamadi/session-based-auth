const { AppError } = require("../utils/app-error");

const validator = (validateSchema) => {
  return (req, res, next) => {
    const { error } = validateSchema.validate(req.body);
    if (!!error) {
      console.error("error in validator", error);
      return next(new AppError(400, error));
    }

    next();
  };
};

module.exports = { validator };

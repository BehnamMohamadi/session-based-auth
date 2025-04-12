const { AppError } = require('../utils/app-error');
const { isValidObjectId } = require('../utils/validate-object-id');

const validateEntityId = (req, res, next, id) => {
  const err = new AppError(400, `invalid employee id: ${id}`);

  if (!isValidObjectId(id)) return next(err);

  next();
};

module.exports = { validateEntityId };

const ObjectId = require('mongoose').Types.ObjectId;

const isValidObjectId = (id) => {
  if (!ObjectId.isValid(id)) return false;
  if (new ObjectId(id).toString() !== id) return false;

  return true;
};

module.exports = { isValidObjectId };

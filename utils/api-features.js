function ApiFeatures(model, queryString) {
  this.model = model;
  this.queryString = queryString;
}

ApiFeatures.prototype.limitFields = function () {
  const { fields = '-__v' } = this.queryString;

  this.model = this.model.select(fields.split(','));

  return this;
};

ApiFeatures.prototype.paginate = function () {
  const { page = 1, limit = 10 } = this.queryString;

  const skip = (page * 1 - 1) * limit * 1;

  this.model = this.model.skip(skip).limit(Number(limit));

  return this;
};

ApiFeatures.prototype.sort = function () {
  const { sort: sortBy = 'createdAt' } = this.queryString;

  this.model = this.model.sort(sortBy);

  return this;
};

ApiFeatures.prototype.filter = function () {
  const { fields, sort, page, limit, ...filter } = this.queryString;
  // filter = { role: 'manager', firstname: 'behnam', dateOfBirth[lte]: '2000-01-01' }

  const filterAsText = JSON.stringify(filter).replace(
    /\b(gt|gte|lt|lte)\b/g,
    (match) => `$${match}`
  );

  this.model = this.model.find(JSON.parse(filterAsText));

  return this;
};

module.exports = { ApiFeatures };

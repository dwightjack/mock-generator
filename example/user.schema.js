const joi = require('../index');

const email = joi.email('internet.email');

const positiveInt = joi.merge(
  joi.type('integer'),
  { minimum : 1, exclusiveMinimum : true }
);

const schema = joi.schema('user');

module.exports = schema(
  joi.shape({
    id: joi.$ref('#/definitions/positiveInt'),
    name: joi.string('name.findName'),
    email
  }),
  joi.defs({ positiveInt }),
  joi.required(['id', 'name', 'email'])
);
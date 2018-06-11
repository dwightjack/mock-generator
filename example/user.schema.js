const skeem = require('../index');

const name = skeem.merge(
  skeem.string,
  skeem.mock('name.findName')
);

const email = skeem.merge(
  skeem.email('internet.email'), 
  skeem.mock('internet.email')
);

const definitions = skeem.defs({
  positiveInt: skeem.prop({
    type: 'integer',
    minimum: 0,
    exclusiveMinimum: true
  })
});

const schema = skeem.schema('user');

module.exports = schema(
  skeem.shape({
    id: skeem.$ref('#/definitions/positiveInt'),
    name,
    email
  }),
  definitions,
  skeem.required(['id', 'name', 'email'])
);
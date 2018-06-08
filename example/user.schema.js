const jp = require('../lib/props');

const name = jp.merge(
  jp.string,
  jp.mock('name.findName')
);

const email = jp.merge(
  jp.email('internet.email'), 
  jp.mock('internet.email')
);

const definitions = jp.defs({
  positiveInt: jp.prop({
    type: 'integer',
    minimum: 0,
    exclusiveMinimum: true
  })
});

const schema = jp.schema('user');

module.exports = schema(
  jp.shape({
    id: jp.$ref('#/definitions/positiveInt'),
    name,
    email
  }),
  definitions,
  jp.required(['id', 'name', 'email'])
);
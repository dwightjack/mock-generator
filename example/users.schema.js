const jp = require('../lib/props');
const store = require('./store');

const schema = jp.schema('users');

module.exports = schema(
  jp.array(jp.$ref(store.resolve('user'))),
  { minItems: 5 }
);
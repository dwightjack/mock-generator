const { schema, array, $ref } = require('../index');
const store = require('./store');

const usersSchema = schema('users');

module.exports = usersSchema(
  array($ref(store.resolve('user'))),
  { minItems: 5 }
);
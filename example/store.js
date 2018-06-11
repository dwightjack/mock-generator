const jsf = require('json-schema-faker');

const { createStore } = require('../index');
module.exports = createStore({
  generator: jsf.resolve
});
const utils = require('./lib/utils');
const keys = require('./lib/keywords');
const types = require('./lib/types');
const { createStore } =  require('./lib/snapshots');

const { toJSON } = utils;

const schema = (name, props) => {
  const h = keys.head(name);
  if (!props) {
    return (...args) => toJSON(h, ...args);
  }
  return toJSON(h, types.shape(props));
};

module.exports = Object.assign(
  { schema, createStore },
  keys,
  types,
  utils
);
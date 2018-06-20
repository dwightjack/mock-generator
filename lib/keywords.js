const { 
  withKey, 
  settings, 
  evaluate,
  defined,
  CORE_FORMATS,
} = require('./utils');

const head = (title, description = '') => ({
  title, 
  description,
  $schema: 'http://json-schema.org/draft-04/schema#'
});

const type = withKey('type')

const mock = (fn, ...args) => {
  if (!settings.mocker) {
    console.warn('mock engine not set.');
    return {};
  }
  if (args.length === 0) {
    return { [settings.mocker]: fn };
  }
  return {
    [settings.mocker]: {
      [fn]: args
    }
  }
};

const format = (value) => {
  return CORE_FORMATS.includes(value) ? { format: value } : null;
};

const value = (v) => {
  const k = Array.isArray(v) ? 'enum' : 'default';
  return { [k]: v };
};

const minmax = (min, max) => {
  const o = {};
  if (defined(min)) {
    o.minItems = evaluate(min)
  }
  if (defined(max)) {
    o.maxItems = evaluate(max)
  }
  return o;
};

const props = withKey('properties');

const required = withKey('required');

const defs = withKey('definitions');

const $ref = withKey('$ref');

module.exports = {
  head,
  $ref,
  defs,
  required,
  props,
  format,
  mock,
  type,
  value,
  minmax
};
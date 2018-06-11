const { 
  withKey, 
  settings, 
  CORE_FORMATS,
} = require('./utils');

const head = (title, description = '') => ({
  title, 
  description,
  $schema: 'http://json-schema.org/draft-04/schema#'
});

const type = withKey('type')

const mock = (fn, ...args) => {
  if (!settings.mock) {
    console.warn('mock engine not set.');
    return {};
  }
  if (args.length === 0) {
    return { [settings.mock]: fn };
  }
  return {
    [settings.mock]: {
      [fn]: args
    }
  }
};
settings.propFormats.set('mock', mock);

const format = (value) => {
  return CORE_FORMATS.includes(value) ? { format: value } : null;
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
  type
};
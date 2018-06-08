const CORE_FORMATS = [
  'date-time', 'email', 'hostname', 'ipv4', 'ipv6', 'uri'
];

const settings = {
  mock: 'faker'
};

const evaluate = (value, ...args) => (typeof value === 'function' ? value(...args) : value);


const withKey = (key) => (value) => ({ [key]: value });

const merge = (...args) => {
  return args.reduce((acc, prop) => (
    Object.assign(acc, evaluate(prop))
  ), {});
};

const toJSON = (...args) => JSON.parse(JSON.stringify(merge(...args)));

const head = (title, description = '') => ({
  title, 
  description,
  $schema: 'http://json-schema.org/draft-04/schema#'
});

const type = withKey('type')

const mock = (fn, ...args) => {
  if (args.length === 0) {
    return { [settings.mock]: fn };
  }
  return {
    [settings.mock]: {
      [fn]: args
    }
  }
};

const format = (value) => {
  return CORE_FORMATS.includes(value) ? { format: value } : null;
};

const propFormats = new Map();

propFormats.set('mock', mock);

const prop = (obj) => {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    if (propFormats.has(k)) {
      return Object.assign(acc, propFormats.get(k)(v))
    }
    acc[k] = v;
    return acc;
    
  }, {});
};

const props = withKey('properties');

const required = withKey('required');

const defs = withKey('definitions');

const $ref = withKey('$ref');

const string = (format) => {
  const obj = type('string');
  if (!format) {
    return obj;
  }
  if (CORE_FORMATS.includes(format)) {
    return Object.assign(obj, { format });
  } else {
    Object.assign(obj, mock(format))
  }
};

const email = (mockType) => merge(
  string('email'),
  mockType && mock(mock),
);

const array = (items) => merge(
  type('array'),
  { items }
);

const shape = (defs) => {
  return merge(
    type('object'),
    defs && props(defs)
  );
}


const schema = (name, props) => {
  const h = head(name);
  if (!props) {
    return (...args) => toJSON(h, ...args);
  }
  return toJSON(h, shape(props));
};


module.exports = {
  merge,
  toJSON,
  evaluate,
  type,
  mock,
  prop,
  props,
  required,
  format,
  defs,
  head,

  $ref,
  string,
  email,
  array,
  shape,

  schema
};
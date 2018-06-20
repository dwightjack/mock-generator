const CORE_FORMATS = [
  'date-time', 'email', 'hostname', 'ipv4', 'ipv6', 'uri'
];

const settings = {
  mocker: 'faker',
};

const configure = (opts) => Object.assign(settings, opts);

const defined = (v) => v !== undefined;

const evaluate = (value, ...args) => (typeof value === 'function' ? value(...args) : value);

const withKey = (key) => (value) => ({ [key]: value });

const merge = (...args) => {
  return args.reduce((acc, prop) => (
    Object.assign(acc, evaluate(prop))
  ), {});
};

const toJSON = (...args) => JSON.parse(JSON.stringify(merge(...args)));

const enhance = (obj, props = {}) => {
  Object.entries(props).forEach(([k, value]) => {
    Object.defineProperty(obj, k, {
      enumerable: false,
      writtable: false,
      value
    });
  });
  return obj;
};

module.exports = {
  CORE_FORMATS,
  settings,
  configure,
  evaluate,
  withKey,
  merge,
  defined,
  enhance,
  toJSON
};
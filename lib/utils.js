const CORE_FORMATS = [
  'date-time', 'email', 'hostname', 'ipv4', 'ipv6', 'uri'
];

const settings = {
  //mock: 'faker',
  propFormats: new Map()
};

const configure = (opts) => Object.assign(settings, opts);

const evaluate = (value, ...args) => (typeof value === 'function' ? value(...args) : value);

const withKey = (key) => (value) => ({ [key]: value });

const merge = (...args) => {
  return args.reduce((acc, prop) => (
    Object.assign(acc, evaluate(prop))
  ), {});
};

const toJSON = (...args) => JSON.parse(JSON.stringify(merge(...args)));

const prop = (obj) => {
  const { propFormats } = settings;
  return Object.entries(obj).reduce((acc, [k, v]) => {
    if (propFormats && propFormats.has(k)) {
      return Object.assign(acc, propFormats && propFormats.get(k)(v))
    }
    acc[k] = v;
    return acc;
    
  }, {});
};


module.exports = {
  CORE_FORMATS,
  settings,
  configure,
  evaluate,
  withKey,
  merge,
  toJSON,
  prop
};
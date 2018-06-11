const { type, mock, props } = require('./keywords');
const { CORE_FORMATS, merge } = require('./utils');

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

module.exports = {
  string,
  email,
  array,
  shape,
  object: shape
};

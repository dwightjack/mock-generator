const { type, mock, props, format, minmax } = require('./keywords');
const { merge, enhance, defined } = require('./utils');

const string = (str) => merge(
  type('string'),
  (str && (format(str) || mock(str)))
);

const email = (mockType) => merge(
  string('email'),
  mockType && mock(mockType),
);

const array = enhance((items, { additionalItems, uniqueItems } = {}) => merge(
  type('array'),
  { items },
  defined(additionalItems) && { additionalItems },
  defined(uniqueItems) && { uniqueItems },
), { minmax });

const shape = (defs) => merge(
  type('object'),
  defs && props(defs)
);

module.exports = {
  string,
  email,
  array,
  shape,
  object: shape
};

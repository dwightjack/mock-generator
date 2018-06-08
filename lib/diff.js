const jsdiff = require('diff');
const { green, red, gray, blue } = require('chalk');

const prependLine = (str, prefix) => {
  return prefix + str.replace(/\n/g, `\n${prefix}`); 
};

const added = (str) => green(prependLine(str, '+'));
const removed = (str) => red(prependLine(str, '-'));
const identity = (str) => gray(str);

const format = (diffs) => {
  return diffs.reduce((str, part) => {

    const color = part.added ? added :
      part.removed ? removed : identity;
    
      return str + color(part.value.trim()) + '\n'; 
  }, '');
}


const diff = (oldSchema, newSchema) => {
  const results = jsdiff.diffJson(oldSchema, newSchema);
  const count = results.reduce((n, p) => n + Boolean(p.added || p.removed) , 0);
  if (count > 0) {
    return {
      count,
      results,
      formatted: format(results)
    };
  } else {
    return {
      count
    };
  }
};

module.exports = {
  diff,
  format
};

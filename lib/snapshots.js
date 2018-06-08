const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');
const { yellow, green } = require('chalk');
const { diff } = require('./diff');

const createStore = ({ destPath } = {}) => {
  
  const p = destPath || path.join(process.cwd(), '.json-snapshots');

  return {
    resolve(name) {
      return path.relative(process.cwd(), this.filename(name));
    },
    filename: (name) => path.join(p, `__snapshot-${name}.json`),
    async read(name) {
      try {
        return await fs.readJson(this.filename(name))
      } catch (e) {
        console.log(`A schema with name "${name}" does not exist in ${p}`);
        return null;
      }
    },
    async write(name, contents) {
      try {
        await fs.outputJson(this.filename(name), contents, { spaces: 2 })
      } catch (e) {
        console.error(`An error occurred processing schema with name "${name}"`, e);
      }
    },

    async update (name, schema) {
      const oldSchema = await this.read(name);
      if (oldSchema) {
        const changes = diff(oldSchema, schema);
    
        if (changes.count > 0) {
          const { save = false, overwrite } = await prompts([{
            type: 'select',
            name: 'overwrite',
            message: `Schema "${name}" has changed. Do you wish to overwrite?`,
            choices: [
              { title: 'Yes', value: true },
              { title: 'No', value: false },
              { title: 'Review changes', value: 'review' }
            ]
          }, {
            type: (prev) => prev === 'review' ? 'confirm' : null,
            name: 'save',
            message() {
              console.log(changes.formatted);
              return 'Save?';
            },
            initial: false
          }]);
    
          if (overwrite === true || save === true) {
            await this.write(name, schema);
            console.log(green(`Schema "${name}" saved!`));
            return true;
          }
          console.log(yellow`Aborted...`);
          return false;
        }
        console.log(`Schema "${name}" unchanged. Skip...`);
        return false;
      }
    
      await this.write(name, schema);
      console.log(green(`Schema "${name}" saved!`));
      return true;
    
    }
  }
};

module.exports = {
  createStore
};
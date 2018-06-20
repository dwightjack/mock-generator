const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');
const { yellow, green, red } = require('chalk');
const globby = require('globby');
const chokidar = require('chokidar');
const { diff } = require('./diff');

const onUpdate = async (name, diffs = '', force = false) => {
  if (force) {
    return {
      save: true
    };
  }

  return await prompts([{
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
      console.log(diffs);
      return 'Save?';
    },
    initial: false
  }]);
}

const identity = (value) => value;

const createStore = ({ snapshotPaths, dataPaths, generator = identity } = {}) => {

  const snapPath = snapshotPaths || path.join(process.cwd(), '.json-snapshots');
  const jsonPath = dataPaths || path.join(process.cwd(), 'json');

  const $store = new Map();

  return {

    resolve(name) {
      return path.relative(process.cwd(), this.filename(name));
    },

    add: (schema) => $store.set(schema.title, schema),

    filename: (name) => path.join(snapPath, `__snapshot-${name}.json`),

    async read(name) {
      try {
        return await fs.readJson(this.filename(name))
      } catch (e) {
        console.log(`A schema with name "${name}" does not exist in ${snapPath}`);
        return null;
      }
    },

    async load(filepath, fresh = false) {
      try {
        if (fresh === true && require.cache[filepath]) {
          delete require.cache[filepath];
        }
        const schema = require(filepath);
        this.add(schema);
        return schema.title;
      } catch (e) {
        console.warn(e);
      }
    },

    async watch(pattern, { cwd, immediate = false } = {}) {
      const watcher = chokidar.watch(pattern, { cwd: cwd || process.cwd(), ignoreInitial: true });
      watcher.on('all', async (event, p) => {
        console.log(`[${event}] ${p}`);
        const schemaName = this.load(path.resolve(cwd, p), true)
        if (schemaName) {
          await this.generateAll();
        }
      });
      if (immediate === true) {
        //read files...
        await this.loadFrom(pattern, { cwd });
        await this.generateAll();
      }
      return watcher;
    },

    async loadFrom(pattern, options = {}) {
      const files = await globby(pattern, options);
      const { cwd = process.cwd(), fresh = false } = options;
      files.forEach((f) => this.load(path.resolve(cwd, f), fresh));
    },

    readData(name) {
      if (!$store.has(name)) {
        return null;
      }
      try {
        const filepath = path.join(jsonPath, `${name}.json`);
        //if it doesn't exist but it's registered 
        //let's try to generate data on demand
        if (!fs.existsSync(filepath)) {
          return this.generate(name)
        }
        return fs.readJson(filepath);
      } catch (e) {
        console.error(e);
      }
    },

    async write(name, schema) {
      try {
        await fs.outputJson(this.filename(name), schema, { spaces: 2 })
      } catch (e) {
        console.error(`An error occurred processing schema with name "${name}"`, e);
      }
    },

    async update (name, force = false) {
      const schema = $store.get(name);

      if (!schema) {
        console.log(`Schema "${name}" not found`);
        return false;
      }

      const oldSchema = await this.read(name);
      if (oldSchema) {
        const changes = diff(oldSchema, schema);
    
        if (changes.count > 0) {
          const { save = false, overwrite } = await onUpdate(name, changes.formatted, force);
    
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
    
    },

    async generate(name, force = false) {
      
      const isUpdated = await this.update(name);
      const destPath = path.resolve(jsonPath, `${name}.json`);
      const exist = fs.existsSync(destPath);

      if (force === false && !isUpdated && exist) {
        console.log(`Schema "${name}" is unchanged. No need to generate new data`);
        return null;
      }

      const schema = $store.get(name);

      try {
        const output = await generator(schema);
        const data = fs.outputJson(destPath, output, { spaces: 2 })
        console.log(green(`JSON data for schema "${name}" written to ${destPath}`));
        return data;
      } catch (e) {
        console.error(red(`Error writing schema "${name}" to ${destPath}`), e);
      }
    },

    async generateAll(force = false) {

      if (force) {
        const oldPaths = await globby(['*.json'], { cwd: jsonPath })

        console.log('Removing old files...');
        await Promise.all(
          oldPaths.map(((p) => fs.remove(p)))
        );
      }

      for (let name of $store.keys()) {
        console.log(`Processing "${name}"`);
        await this.generate(name, force);
      }
    }
  }
};

module.exports = {
  createStore
};
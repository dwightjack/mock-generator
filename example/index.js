
const skeem = require('../index');

skeem.configure({
  mocker: 'faker'
});

const store = require('./store');

(async () => {
  /*await store.loadFrom('./*.schema.js', {
    cwd: __dirname
  });
  await store.generateAll();*/
  store.watch('./*.schema.js', {
    cwd: __dirname,
    immediate: true
  });
  //console.log(JSON.stringify(await store.readData('user'), null, 2))
})();



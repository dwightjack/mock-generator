
const skeem = require('../index');

skeem.configure({
  mock: 'faker'
});

const store = require('./store');
const userSchema = require('./user.schema');
const usersSchema = require('./users.schema');



store.add(userSchema);
store.add(usersSchema);

store.generateAll();


(async () => {
  console.log(JSON.stringify(await store.readData('user'), null, 2))
})();



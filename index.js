const path = require('path');
const jsf = require('json-schema-faker');
const fs = require('fs-extra');

const store = require('./example/store');
const userSchema = require('./example/user.schema');
const usersSchema = require('./example/users.schema');



/*
const schema = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: {
          $ref: '#/definitions/positiveInt'
        },
        name: {
          type: 'string',
          faker: 'name.findName'
        },
        email: {
          type: 'string',
          format: 'email',
          faker: 'internet.email'
        }
      },
      required: ['id', 'name', 'email']
    }
  },
  required: ['user'],
  definitions: {
    positiveInt: {
      type: 'integer',
      minimum: 0,
      exclusiveMinimum: true
    }
  }
};*/

const generate = async (schema, name) => {
  const updated = await store.update(schema.title, schema);
  if (updated) {
    const output = await jsf.resolve(schema);
    return fs.outputJson(path.resolve(__dirname, 'dist', `${name || schema.title}.json`), output, { spaces: 2 })
  }
}

generate(userSchema, 'user')
generate(usersSchema, 'users')



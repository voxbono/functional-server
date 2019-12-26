const indexHandler = require ('../handlers/index');
const usersHandler = require ('../handlers/users');

module.exports = {
  'GET /': indexHandler,
  'GET /users': usersHandler
};

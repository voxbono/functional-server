const users = require ('../state/users');

module.exports = req => res => res.end (JSON.stringify (users));

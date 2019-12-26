const users = require ('../state/users');

// :: req -> res -> http response
module.exports = req => res => res.end (JSON.stringify (users));

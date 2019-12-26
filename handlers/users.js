const users = require ('../state/users');

module.exorts = req => res => res.end (JSON.stringify (users));

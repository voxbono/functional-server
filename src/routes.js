const S = require ('./lib/sanctuary');
const { Literal, Capture } = require ('./lib/types');
const indexHandler = require ('./handlers/index');
const { getAllUsers, getUserById, addUser } = require ('./handlers/users');

// routes :: [Pair ([Literal || Capture], StrMap f)]
module.exports = [
  S.Pair ([]) ({ GET: indexHandler }),
  S.Pair ([Literal ('users')]) ({ GET: getAllUsers }),
  S.Pair ([Literal ('users'), Literal ('add')]) ({ POST: addUser }),
  S.Pair ([Literal ('users'), Capture ('id')]) ({ GET: getUserById }),
  S.Pair ([Literal ('something')]) ({ GET: data => S.Just ('This is something') })
];

const S = require ('./lib/sanctuary');
const { Literal, Capture } = require ('./lib/types');
const indexHandler = require ('./handlers/index');
const { getAllUsers, getUserById, getUsersWithQuery, addUser } = require ('./handlers/users');
const { queryTest, bodyQueryParamTest } = require ('./handlers/testhandlers');

// routes :: [Pair ([Literal || Capture], StrMap f)]
module.exports = [
  S.Pair ([]) ({ GET: indexHandler }),
  S.Pair ([Literal ('users')]) ({ GET: getAllUsers }),
  S.Pair ([Literal ('users'), Literal ('query')]) ({ GET: getUsersWithQuery }),
  S.Pair ([Literal ('users'), Literal ('add')]) ({ POST: addUser }),
  S.Pair ([Literal ('users'), Capture ('id')]) ({ GET: getUserById }),
  S.Pair ([Literal ('querytest')]) ({ GET: queryTest }),
  S.Pair ([Literal ('querytest'), Capture ('id'), Capture ('name')]) ({ POST: bodyQueryParamTest })
];

const S = require ('../lib/sanctuary');
const { Literal, Capture } = require ('../types/types');
const indexHandler = require ('../handlers/index');
const usersHandler = require ('../handlers/users');


module.exports = [
  S.Pair ([]) ({ GET: indexHandler }),
  S.Pair ([Literal ('users')]) ({ GET: usersHandler }),
  S.Pair ([Literal ('users'), Capture ('id')]) ({ GET: data => `The user has id: ${data.id}` }),
  S.Pair ([Literal ('something')]) ({ GET: data => 'This is something' })
];

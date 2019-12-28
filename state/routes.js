const S = require ('sanctuary');
const { Literal, Capture } = require ('../types/types');
const indexHandler = require ('../handlers/index');
const usersHandler = require ('../handlers/users');


module.exports = [
  S.Pair ([]) (indexHandler),
  S.Pair ([Literal ('users')]) (usersHandler),
  S.Pair ([Literal ('users'), Capture ('id')]) (data => `The user has id: ${data.id}`),
  S.Pair ([Literal ('something')]) (data => 'This is something')
];

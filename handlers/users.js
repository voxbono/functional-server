const S = require ('../lib/sanctuary');
const users = require ('../state/users');


// :: () -> Object
const getAllUsers = () => S.Just (users);
const getUserById = S.pipe ([
  ({ id }) => S.parseInt (10) (id),
  S.chain
    (id =>
      S.find
        (user => id  === user.id)
        (users)
    )
]);
module.exports = { getAllUsers, getUserById };

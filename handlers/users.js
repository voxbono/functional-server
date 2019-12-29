const S = require ('../lib/sanctuary');
const users = require ('../state/users');

// :: () -> Maybe Array Object
const getAllUsers = () => S.Just (users);

// StrMap a -> Maybe StrMap b
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

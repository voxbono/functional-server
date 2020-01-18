const S = require ('../lib/sanctuary');
const users = require ('../state/users');

// findItembyId :: Int -> Array Object -> Maybe Object
const findItembyId = id => S.find (item => id  === item.id);

// findUserById :: Array Object -> Maybe String -> Maybe Object
const findUserById = users => S.pipe ([
  S.chain (S.parseInt (10)),
  S.chain ((id => findItembyId (id) (users)))
]);

// findUsersByIds :: Array Object -> Maybe (Array String) ->  Array Object
const findUsersByIds = users => S.pipe ([
  S.sequence (Array),
  S.map (findUserById (users)),
  S.map (S.fromMaybe ({}))
]);

// :: {} -> Future Void Response
const getAllUsers = headers => body => params => query =>
  ({ statusCode: 200, body: S.Just (JSON.stringify (users)) });

// { params :: StrMap } -> Future Void Response
const getUserById = headers => body => params => query =>
  S.maybe ({ statusCode: 404, body: S.Nothing })
          (user => ({ statusCode: 200, body: S.Just (JSON.stringify (user)) }))
          (findUserById (users) (S.value ('id') (params)));

// { Query :: StrMap (Array String)} -> Future Void Response
const getUsersWithQuery = headers => body => params => query => ({
  statusCode: 200,
  body: S.Just (JSON.stringify (findUsersByIds (users) (S.value ('id') (query))))
});

//  addUser:: {email:: String} -> {} -> StrMap (Array String) -> Future Void Response
const addUser = headers => ({ id, name, email }) => params => query =>
  ({ statusCode: 200, body: S.Just (JSON.stringify ({ id, name, email })) });

module.exports = { getAllUsers, getUserById, addUser, getUsersWithQuery };

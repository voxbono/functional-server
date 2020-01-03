const Future = require ('fluture');
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
const getAllUsers = () =>
  Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (users)) });

// { params :: StrMap } -> Future Void Response
const getUserById = ({ params }) =>
  S.maybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
          (user => Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (user)) }))
          (findUserById (users) (S.value ('id') (params)));

// { Query :: StrMap (Array String)} -> Future Void Response
const getUsersWithQuery = ({ query }) =>
  Future.resolve ({
    statusCode: 200,
    body: S.Just (JSON.stringify (findUsersByIds (users) (S.value ('id') (query))))
});

// { body :: StrMap (Array String), query :: StrMap (Array String)} -> Future Void Response
const addUser = ({ body }) =>
  Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (body)) });

module.exports = { getAllUsers, getUserById, addUser, getUsersWithQuery };

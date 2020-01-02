const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const users = require ('../state/users');

// :: {} -> Future Void Response
const getAllUsers = () =>
  Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (users)) });

// { id :: String } -> Future Void Response
const getUserById = ({ params }) =>
  S.maybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
          (user => Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (user)) }))
          (S.chain (id => S.find (user => id  === user.id) (users))
                   (S.parseInt (10) (params.id)));

// { data :: StrMap } -> Future Void Response
const addUser = ({ body, query }) =>
  Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (S.concat (body) (query))) });

module.exports = { getAllUsers, getUserById, addUser };

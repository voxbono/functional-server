const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const users = require ('../state/users');

// :: {} -> Future Void Response
const getAllUsers = () =>
  Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (users)) });

// { id :: String } -> Future Void Response
const getUserById = ({ id }) =>
  S.maybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
          (user => Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (user)) }))
          (S.chain (id => S.find (user => id  === user.id) (users))
                   (S.parseInt (10) (id)));

// { data :: StrMap } -> Future Void Response
const addUser = ({ data }) =>
  S.maybe (Future.resolve ({ statusCode: 400, body: S.Nothing }))
          (d => Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (d)) }))
          (data);

module.exports = { getAllUsers, getUserById, addUser };

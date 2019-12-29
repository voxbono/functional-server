const S = require ('../lib/sanctuary');
const users = require ('../state/users');
const Future = require ('fluture');

// :: {} -> Future Void Response
const getAllUsers = () => Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (users)) });

// { id :: String } -> Future Void Response
const getUserById = ({ id }) =>
  S.maybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
          (user => Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (user)) }))
          (S.chain (id => S.find (user => id  === user.id) (users))
                   (S.parseInt (10) (id)));

module.exports = { getAllUsers, getUserById };

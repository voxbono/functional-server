const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const users = require ('../state/users');

const findUserById = users => S.pipe ([
  S.chain (S.parseInt (10)),
  S.chain ((id => S.find (user => id  === user.id) (users)))
]);

// :: {} -> Future Void Response
const getAllUsers = () =>
  Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (users)) });

// { params :: StrMap } -> Future Void Response
const getUserById = ({ params }) =>
  S.maybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
          (user => Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (user)) }))
          (findUserById (users) (S.value ('id') (params)));

const getUserWithQuery = ({ query }) =>
  S.maybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
          (user => Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (user)) }))
          (findUserById (users) (S.value ('id') (query)));

// { data :: StrMap } -> Future Void Response
const addUser = ({ body, query }) =>
  Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (S.concat (body) (query))) });

module.exports = { getAllUsers, getUserById, addUser, getUserWithQuery };

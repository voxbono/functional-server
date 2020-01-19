const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const users = require ('../state/users');
const { JSONResponse } = require ('../types/Responses');

// findItembyId :: Int -> Array Object -> Maybe Object
const findItembyId = id => S.find (item => id  === item.id);

// findUserById :: Array Object -> String -> Maybe Object
const findUserById = users => S.pipe ([
  S.parseInt (10),
  S.chain ((id => findItembyId (id) (users))),
]);

// findUsersByIds :: Array Object -> Maybe (StrMap (Array String)) ->  Maybe (Array Object)
const findUsersByIds = users => S.pipe ([
  S.chain (S.value ('id')),
  S.map (S.map (findUserById (users))),
  S.map (S.map (S.fromMaybe ({})))
]);

// :: {} -> Future Void Response
const getAllUsers = _ =>
  Future.resolve (JSONResponse (200) (S.Just (users)));

// { params :: StrMap } -> Future Void Response
const getUserById = ({ params }) =>
  S.maybe (Future.resolve (JSONResponse (404) (S.Nothing)))
          (user => Future.resolve (JSONResponse (200) (S.Just (user))))
          (findUserById (users) (S.fromMaybe ('') (S.value ('id') (params))));

// { Query :: {query :: Maybe (StrMap (Array String))} -> Future Void Response
const getUsersWithQuery = ({ query }) => Future.resolve (
  JSONResponse (200) (S.Just (S.fromMaybe ([{}]) (findUsersByIds (users) (query))))
);

//  addUser:: {body:: StrMap String} -> Future Void Response
const addUser = ({ body }) => Future.resolve (
  S.maybe (JSONResponse (404) (S.Nothing))
          (({ id, name, email }) => JSONResponse (200) (S.Just ({ id, name, email })))
          (body));

module.exports = { getAllUsers, getUserById, addUser, getUsersWithQuery };

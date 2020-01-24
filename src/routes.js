const $ = require ('sanctuary-def');
const S = require ('./lib/sanctuary');
const Future = require ('fluture');
const { Literal, Capture } = require ('./types/Component');
const indexHandler = require ('./handlers/index');
const { getAllUsers, getUserById, getUsersWithQuery, addUser } = require ('./handlers/users');
const { queryTest, bodyQueryParamTest, loginTest, htmlTest } = require ('./handlers/testhandlers');
const { JSONResponse } = require ('./types/Responses');

const userRecordType = $.RecordType ({ id: $.Integer, name: $.String, email: $.String });

const validateAuth = auth => auth === 'password' ? S.Just ('User 1') : S.Nothing;

const protection = handler => ({ headers, body, params, query }) =>
  S.maybe (Future.resolve (JSONResponse (401) (S.Nothing)))
          (auth => S.maybe (Future.resolve (JSONResponse (401) (S.Nothing)))
                           (user => handler (({ headers, body, params, query, user })))
                           (validateAuth (auth)))
          (S.value ('authorization') (headers));

// routes :: [Pair [Component] (StrMap Object)]
module.exports = [
  S.Pair ([]) ({ GET: { handler: indexHandler } }),
  S.Pair ([Literal ('users')]) ({ GET: { handler: getAllUsers } }),
  S.Pair ([Literal ('users'), Literal ('query')]) ({ GET: { handler: getUsersWithQuery } }),
  S.Pair ([Literal ('users'), Literal ('add')]) ({ POST: { body: userRecordType, handler: addUser } }),
  S.Pair ([Literal ('users'), Capture ('id')]) ({ GET: { handler: getUserById } }),
  S.Pair ([Literal ('querytest')]) ({ GET: { handler: queryTest } }),
  S.Pair ([Literal ('querytest'), Literal ('login')]) ({ GET: { handler: protection (loginTest) } }),
  S.Pair ([Literal ('querytest'), Capture ('id'), Capture ('name')]) ({ POST: { body: $.Any, handler: bodyQueryParamTest } }),
  S.Pair ([Literal ('querytest'), Literal ('gethtml')]) ({ GET: { handler: htmlTest } })
];

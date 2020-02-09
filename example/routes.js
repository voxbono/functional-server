const { $, S, Future } = require ('../src/server');
const { Literal, Capture } = require ('../src/types/Component');
const { JSONResponse } = require ('../src/types/Responses');
const indexHandler = require ('./handlers/index');
const { getAllUsers, getUserById, getUsersWithQuery, addUser } = require ('./handlers/users');
const { queryTest, bodyQueryParamTest, loginTest, htmlTest } = require ('./handlers/testhandlers');
const { Get, Post } = require ('../src/types/Handler/Handler.data');

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
  S.Pair ([]) ([Get (indexHandler)]),
  S.Pair ([Literal ('users')]) ([Get (getAllUsers)]),
  S.Pair ([Literal ('users'), Literal ('query')]) ([Get (getUsersWithQuery)]),
  S.Pair ([Literal ('users'), Literal ('add')]) ([Post (userRecordType) (addUser)]),
  S.Pair ([Literal ('users'), Capture ('id')]) ([Get (getUserById)]),
  S.Pair ([Literal ('querytest')]) ([Get (queryTest)]),
  S.Pair ([Literal ('querytest'), Literal ('login')]) ([Get (protection (loginTest))]),
  S.Pair ([Literal ('querytest'), Capture ('id'), Capture ('name')])
         ([Post ($.Any) (bodyQueryParamTest)]),
  S.Pair ([Literal ('querytest'), Literal ('gethtml')]) ([Get (htmlTest)]),
  S.Pair ([Literal ('nohandler')]) ([])
];

const $ = require ('sanctuary-def');
const S = require ('./lib/sanctuary');
const { Literal, Capture } = require ('./types/Component');
const indexHandler = require ('./handlers/index');
const { getResponse } = require ('./helpers/requestData');
const { getAllUsers, getUserById, getUsersWithQuery, addUser } = require ('./handlers/users');
const { queryTest, bodyQueryParamTest } = require ('./handlers/testhandlers');


// routes :: [Pair [Component] (StrMap (String -> Maybe String -> String -> Future Void Response))]
module.exports = [
  S.Pair ([])
         ({ GET: getResponse ($.Any) (indexHandler) }),
  S.Pair ([Literal ('users')])
         ({ GET: getResponse ($.Any) (getAllUsers) }),
  S.Pair ([Literal ('users'), Literal ('query')])
         ({ GET: getResponse ($.Any) (getUsersWithQuery) }),
  S.Pair ([Literal ('users'), Literal ('add')])
         ({ POST: getResponse ($.RecordType ({ id: $.Integer, name: $.String, email: $.String }))
                              (addUser) }),
  S.Pair ([Literal ('users'), Capture ('id')])
         ({ GET: getResponse ($.Any) (getUserById) }),
  S.Pair ([Literal ('querytest')])
         ({ GET: getResponse ($.Any) (queryTest) }),
  S.Pair ([Literal ('querytest'), Capture ('id'), Capture ('name')])
         ({ POST: getResponse ($.Any) (bodyQueryParamTest) })
];

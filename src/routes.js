const $ = require ('sanctuary-def');
const S = require ('./lib/sanctuary');
const { Literal, Capture } = require ('./types/Component');
const indexHandler = require ('./handlers/index');
const { getResponse } = require ('./helpers/requestData');
const { getAllUsers, getUserById, getUsersWithQuery, addUser } = require ('./handlers/users');
const { queryTest, bodyQueryParamTest } = require ('./handlers/testhandlers');

const userRecordType = S.Just ($.RecordType ({ id: $.Integer, name: $.String, email: $.String }));

// Handler :: a -> StrMap String -> StrMap String -> Object Response
// partiallyGetResponse :: string -> Maybe String -> String -> StrMap Sring-> Future Void Response
// routes :: [Pair [Component] (StrMap (Maybe (Type a) -> Handler -> partiallyGetResponse))]
module.exports = [
  S.Pair ([]) ({ GET: getResponse (S.Nothing) (indexHandler) }),
  S.Pair ([Literal ('users')]) ({ GET: getResponse (S.Nothing) (getAllUsers) }),
  S.Pair ([Literal ('users'), Literal ('query')])
         ({ GET: getResponse (S.Nothing) (getUsersWithQuery) }),
  S.Pair ([Literal ('users'), Literal ('add')]) ({ POST: getResponse (userRecordType) (addUser) }),
  S.Pair ([Literal ('users'), Capture ('id')]) ({ GET: getResponse (S.Nothing) (getUserById) }),
  S.Pair ([Literal ('querytest')]) ({ GET: getResponse (S.Nothing) (queryTest) }),
  S.Pair ([Literal ('querytest'), Capture ('id'), Capture ('name')])
         ({ POST: getResponse (S.Just ($.Any)) (bodyQueryParamTest) })
];

const querystring = require ('querystring');
const S = require ('../lib/sanctuary');
const $ = require ('sanctuary-def');

// validHeaders :: StrMap
const validHeaders = {
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  JSON: 'application/json'
};

// parseRequestData :: String -> String -> Maybe StrMap
const parseRequestBody = header => dataString => {
  switch (header) {
    case validHeaders.FORM_URLENCODED:
      return S.Just (querystring.parse (dataString));
    case validHeaders.JSON:
      return S.parseJson (S.is ($.Any)) (dataString);
    default:
      return S.parseJson (S.is ($.Any)) (dataString);
  }
};

// parseRequestQuery :: String -> Maybe StrMap
const parseRequestQuery = S.pipe ([
  S.splitOn ('?'),
  S.drop (1),
  S.chain (S.head),
  S.map (item => querystring.parse (item)),
]);

module.exports = { parseRequestBody, parseRequestQuery };

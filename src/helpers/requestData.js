const querystring = require ('querystring');
const S = require ('../lib/sanctuary');
const $ = require ('sanctuary-def');

// validHeaders :: StrMap
const validHeaders = {
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  JSON: 'application/json'
};

// parseRequestData :: String -> String -> Maybe (StrMap String)
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

// parseRequestQuery :: String -> Maybe (StrMap String)
const parseRequestQuery = S.pipe ([
  S.splitOn ('?'),
  S.drop (1),
  S.chain (S.head),
  S.map (item => querystring.parse (item)),
]);

//    matchComponent :: Component -> String -> Maybe (StrMap String)
const matchComponent = c => s => {
  switch (c.tagName) {
    case 'Literal':
      return s === c.value ? S.Just ({}) : S.Nothing;
    case 'Capture':
      return S.Just (S.singleton (c.value) (s));
  }
};

module.exports = { parseRequestBody, parseRequestQuery, matchComponent };

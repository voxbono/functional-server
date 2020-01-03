const S = require ('../lib/sanctuary');
const $ = require ('sanctuary-def');

// validHeaders :: StrMap
const validHeaders = {
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  JSON: 'application/json'
};

// getHeadAsString :: Array String -> String
const getHeadAsString = item => S.fromMaybe ('') (S.head (item));

// getTailAsArray :: Array String -> Array String
const getTailAsArray = item => S.fromMaybe ([]) (S.tail (item));

// getkeyAsString :: Object -> String
const getkeyAsString = item => S.fromMaybe ('') (S.head (Object.keys (item)));

// parseQueryString :: String -> StrMap (Array String)
const parseQueryString = S.pipe ([
  S.splitOn ('&'),
  S.map (S.splitOn ('=')),
  S.map (item => S.singleton (getHeadAsString (item)) (getTailAsArray (item))),
  S.reduce (acc => curr => {
    const key = getkeyAsString (curr);
    return acc[key]
     ? S.concat (acc) ({ [key]: S.concat (acc[key]) (curr[key]) })
     : S.concat (acc) (curr);
  }) ({})
]);

// parseRequestData :: String -> String -> Maybe (StrMap String) || Maybe (StrMap (Array String))
const parseRequestBody = header => dataString => {
  switch (header) {
    case validHeaders.FORM_URLENCODED:
      return S.Just (parseQueryString (dataString));
    case validHeaders.JSON:
      return S.parseJson (S.is ($.Any)) (dataString);
    default:
      return S.parseJson (S.is ($.Any)) (dataString);
  }
};

// parseRequestQuery :: String -> Maybe (StrMap (Array String))
const parseRequestQuery = S.pipe ([
  S.splitOn ('?'),
  S.drop (1),
  S.chain (S.head),
  S.map (item => parseQueryString (item))
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

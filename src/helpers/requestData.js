const S = require ('../lib/sanctuary');
const $ = require ('sanctuary-def');

// validHeaders :: StrMap
const validHeaders = {
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  JSON: 'application/json'
};

// maybeMergeArrays :: Array a -> Maybe Array a -> Array a
const maybeMergeArrays = list => S.maybe (list) (a => S.concat (a) (list));

// mergeStrMapWithArray :: StrMap (Array a) -> a -> Array a -> StrMap (Array a)
const mergeStrMapWithArray = obj => a => list =>
  S.concat (obj)
           (S.singleton (a)
                        (maybeMergeArrays (list)
                                        (S.value (a) (obj))));

// parseQueryString :: String -> StrMap (Array String)
const parseQueryString = S.pipe ([
  S.splitOn ('&'),
  S.reduce (acc => curr =>
            S.array ({})
                    (mergeStrMapWithArray (acc))
                    (S.splitOn ('=') (curr)))
           ({})
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
  S.map (parseQueryString)
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

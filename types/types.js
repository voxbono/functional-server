const S = require ('sanctuary');

//    Literal :: String -> Component
const Literal = value => ({ tagName: 'Literal', value });

//    Capture :: String -> Component
const Capture = value => ({ tagName: 'Capture', value });

//    matchComponent :: Component -> String -> Maybe (StrMap String)
const matchComponent = c => s => {
  switch (c.tagName) {
    case 'Literal':
      return s === c.value ? S.Just ({}) : S.Nothing;
    case 'Capture':
      return S.Just (S.singleton (c.value) (s));
  }
};

module.exports = {
  Literal,
  Capture,
  matchComponent
};

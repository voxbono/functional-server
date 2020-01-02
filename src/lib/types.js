//    Literal :: String -> Component
const Literal = value => ({ tagName: 'Literal', value });

//    Capture :: String -> Component
const Capture = value => ({ tagName: 'Capture', value });

module.exports = {
  Literal,
  Capture
};

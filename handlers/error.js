const http = require ('http');

// :: req -> res -> Int -> http response
module.exports = req => res => code => {
  res.writeHead (code);
  res.end (JSON.stringify (http.STATUS_CODES[code]));
};

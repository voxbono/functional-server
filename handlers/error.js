const http = require ('http');

module.exports = req => res => code => {
  res.writeHead (code);
  res.end (JSON.stringify (http.STATUS_CODES[code]));
};

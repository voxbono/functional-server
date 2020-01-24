const S = require ('../lib/sanctuary');

const JSONResponse = statusCode => maybeData => ({
  statusCode,
  body: S.map (data => JSON.stringify (data)) (maybeData),
  contentType: 'application/json; charset=utf-8'
});

const HTMLResponse = statusCode => maybeData => ({
  statusCode,
  body: maybeData,
  contentType: 'text/html; charset=utf-8'
});

module.exports = {
  JSONResponse,
  HTMLResponse
};

const S = require ('../lib/sanctuary');

const JSONResponse = statusCode => maybeData => ({
  statusCode,
  body: S.map (data => JSON.stringify (data)) (maybeData),
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});

const HTMLResponse = statusCode => maybeData => ({
  statusCode,
  body: maybeData,
  headers: {
    'Content-Type': 'text/html; charset=utf-8'
  }
});

module.exports = {
  JSONResponse,
  HTMLResponse
};
